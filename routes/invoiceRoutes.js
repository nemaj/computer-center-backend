const express = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", invoiceController.generateInvoice);
router.get("/check", invoiceController.checkInvoice);

module.exports = router;
