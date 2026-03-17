const express = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", invoiceController.generateInvoice);

module.exports = router;
