const Plan = require("../models/Plan");

function camelToSnake(data) {
  return {
    plan_name: data.planName,
    price: parseInt(data.price),
    description: data.description,
  };
}

function snakeToCamel(data) {
  return {
    id: data._id,
    planName: data.plan_name,
    price: String(data.price),
    description: data.description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// CREATE
exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(camelToSnake(req.body));
    res.status(201).json(snakeToCamel(plan));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getPlans = async (req, res) => {
  try {
    const search = req.query.search;
    const filter = search
      ? {
          $or: [{ plan_name: { $regex: search, $options: "i" } }],
        }
      : {};
    const plans = await Plan.find(filter);
    res.json(plans.map(snakeToCamel));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    res.json(snakeToCamel(plan));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      camelToSnake(req.body),
      {
        new: true,
      },
    );
    res.json(snakeToCamel(plan));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
