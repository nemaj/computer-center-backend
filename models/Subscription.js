const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    customer_id: String,
    plan_id: String,
    start_date: String,
    end_date: String,
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
