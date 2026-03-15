const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    plan_name: String,
    price: Number,
    description: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Plan", PlanSchema);
