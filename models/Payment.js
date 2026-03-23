const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    invoice_id: String,
    amount_paid: Number,
    payment_date: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Payment", PaymentSchema);
