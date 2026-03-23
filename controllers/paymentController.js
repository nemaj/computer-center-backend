const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

function camelToSnake(data) {
  return {
    invoice_id: data.invoiceId,
    amount_paid: data.amountPaid,
    payment_date: data.paymentDate,
  };
}

function snakeToCamel(data) {
  return {
    id: data._id,
    invoiceId: data.invoice_id,
    amountPaid: data.amount_paid,
    paymentDate: data.payment_date,
  };
}

// CREATE
exports.createPayment = async (req, res) => {
  try {
    const invoiceId = req.body.invoiceId;
    const invoiceStatus = req.body.status;

    const invoice = await Invoice.updateOne(
      { _id: invoiceId },
      { $set: { status: invoiceStatus } },
    );
    const payment = await Payment.create(camelToSnake(req.body));
    res.status(201).json(snakeToCamel(payment));
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
