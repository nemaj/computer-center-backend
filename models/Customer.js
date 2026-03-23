const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    account_number: {
      type: String,
      required: true,
    },
    last_name: String,
    first_name: String,
    middle_name: String,
    address: String,
    contact: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Customer", CustomerSchema);
