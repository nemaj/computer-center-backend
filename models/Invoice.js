const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    subscription_id: String,
    invoice_date: String,
    due_date: String,
    total_amount: String,
    status: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
