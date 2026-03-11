const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    dueDate: String,
    lastName: String,
    firstName: String,
    middleName: String,
    address: String,
    contact: String,
    monthlyAmount: Number,
    balance: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", CustomerSchema);
