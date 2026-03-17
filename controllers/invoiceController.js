const Invoice = require("../models/Invoice");
const Subscription = require("../models/Subscription");

function camelToSnake(data) {
  return {
    customer_id: data.customerId,
    plan_id: data.planId,
    start_date: data.startDate,
    end_date: data.endDate,
    status: data.status,
  };
}

function snakeToCamel(data) {
  return {
    id: data._id,
    customerId: data.customer_id,
    planId: data.plan_id,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// CREATE INVOICES
exports.generateInvoice = async (req, res) => {
  try {
    const search = req.query.search;
    const filter = search
      ? {
          $or: [{ plan_name: { $regex: search, $options: "i" } }],
        }
      : {};
    const plans = await Subscription.find(filter);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHECK INVOICE FOR THIS MONTH
exports.checkInvoice = async (req, res) => {
  try {
    const date = req.query.date;
    const filter = date
      ? {
          $or: [{ invoice_date: { $regex: date, $options: "i" } }],
        }
      : {};
    const invoices = await Invoice.find(filter);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
