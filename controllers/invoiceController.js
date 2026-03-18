const Invoice = require("../models/Invoice");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const { format } = require("date-fns");

// CREATE INVOICES
exports.generateInvoice = async (req, res) => {
  try {
    const date = new Date();

    const invoices = await Invoice.countDocuments({
      $or: [
        {
          invoice_date: {
            $regex: format(date, "yyyy-MM"),
            $options: "i",
          },
        },
      ],
    });

    if (invoices <= 0) {
      const subscriptions = await Subscription.aggregate([
        {
          $match: { status: "active" },
        },
        {
          $addFields: {
            planObjId: { $toObjectId: "$plan_id" },
          },
        },
        {
          $lookup: {
            from: "plans",
            localField: "planObjId",
            foreignField: "_id",
            as: "plan",
          },
        },
        { $unwind: "$plan" },
        {
          $project: {
            _id: 1,
            start_date: 1,
            plan: {
              price: 1,
            },
          },
        },
      ]);
      const datas = subscriptions.map((subs) => ({
        subscription_id: subs._id,
        invoice_date: format(new Date(), "yyyy-MM-dd"),
        due_date: subs.start_date,
        total_amount: subs.plan.price,
      }));
      const results = await Invoice.insertMany(datas);
      res.json(results);
      return;
    }

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHECK INVOICE FOR THIS MONTH
exports.checkInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      $or: [
        {
          invoice_date: {
            $regex: format(new Date(), "yyyy-MM"),
            $options: "i",
          },
        },
      ],
    });

    const subscriptions = await Subscription.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $addFields: {
          planObjId: { $toObjectId: "$plan_id" },
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "planObjId",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: "$plan" },
    ]);

    // const plans = await Plan.aggregate([
    //   {
    //     $addFields: {
    //       id_str: { $toString: "$_id" }, // convert ObjectId to string
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "subscriptions",
    //       localField: "id_str",
    //       foreignField: "plan_id",
    //       as: "subs",
    //     },
    //   },
    // ]);

    const invoiceDatas = subscriptions.reduce((acc, subs) => {
      const find = (invoices ?? []).find((i) => i.subscription_id === subs._id);
      // if (!find) {
      //   // const plan = await Plan.findById(subs.plan_id);
      //   acc = [
      //     ...acc,
      //     {
      //       id: subs._id,
      //       due_date: subs.start_date,
      //       price: subs.plan.price,
      //     },
      //   ];
      // }
      return [...acc, {}];
    }, []);
    // .map((subs) => ({
    //   subscription_id: subs.id,
    //   invoice_date: format(new Date(), "yyyy-MM-dd"),
    //   due_date: subs.due_date,
    //   total_amount: subs.price,
    // }));

    // const results = await Invoice.insertMany(invoiceDatas);

    // Calculate the start and end dates for the current month in your application code
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // const list = await Subscription.aggregate([
    //   {
    //     // Stage 1: Join with the 'invoices' collection
    //     $lookup: {
    //       from: "invoices",
    //       localField: "_id",
    //       foreignField: "subscriptionId",
    //       as: "monthlyInvoices",
    //     },
    //   },
    //   {
    //     // Stage 2: Filter the joined invoices to only include those from the current month
    //     $addFields: {
    //       monthlyInvoices: {
    //         $filter: {
    //           input: "$monthlyInvoices",
    //           as: "invoice",
    //           cond: {
    //             $and: [
    //               { $gte: ["$$invoice.invoiceDate", startOfMonth] },
    //               { $lt: ["$$invoice.invoiceDate", endOfMonth] },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     // Stage 3: Match subscriptions where the filtered 'monthlyInvoices' array is empty
    //     $match: {
    //       monthlyInvoices: { $size: 0 },
    //     },
    //   },
    //   {
    //     // Stage 4 (Optional): Project the final output to exclude the empty 'monthlyInvoices' array
    //     $project: {
    //       monthlyInvoices: 0,
    //     },
    //   },
    // ]);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JS Date month: 0–11, MongoDB month: 1–12

    const list = await Subscription.aggregate([
      // Step 1: Only active subscriptions
      { $match: { status: "active" } },

      // Step 2: Lookup invoices for this subscription for the current month/year
      {
        $lookup: {
          from: "invoices",
          let: { subId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$subscription_id", "$$subId"] },
                    { $eq: [{ $year: "$invoice_date" }, 2026] },
                    { $eq: [{ $month: "$invoice_date" }, 2] },
                  ],
                },
              },
            },
          ],
          as: "month_invoices",
        },
      },

      // Step 3: Keep subscriptions with NO invoices for this month
      { $match: { month_invoices: { $eq: [] } } }, // <-- key: empty array means no invoice

      // Optional: project the fields you want
      {
        $project: {
          _id: 1,
          customer_id: 1,
          plan_id: 1,
          status: 1,
          start_date: 1,
          end_date: 1,
          next_billing_date: 1,
        },
      },
    ]);

    res.json({
      // invoices,
      // subscriptions,
      // invoiceDatas,
      year,
      month,
      list,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
