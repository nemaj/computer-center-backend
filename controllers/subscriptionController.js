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

// CREATE
exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(camelToSnake(req.body));
    res.status(201).json(snakeToCamel(subscription));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getSubscription = async (req, res) => {
  try {
    const customerId = req.query.customerId;
    const subscription = await Subscription.findOne({
      customer_id: customerId,
    });
    if (!subscription) {
      res.json({});
    } else {
      res.json(snakeToCamel(subscription));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      camelToSnake(req.body),
      {
        new: true,
      },
    );
    res.json(snakeToCamel(subscription));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
