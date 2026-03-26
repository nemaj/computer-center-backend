const express = require("express");
const inventoryTransactionController = require("../controllers/inventoryTransactionController");

const router = express.Router();

router.post("/", inventoryTransactionController.createTransaction);
router.get("/", inventoryTransactionController.getTransactions);
router.put("/:id", inventoryTransactionController.updateTransaction);

module.exports = router;
