const express = require("express");
const subscriptionController = require("../controllers/subscriptionController");

const router = express.Router();

router.get("/", subscriptionController.getSubscription);
router.post("/", subscriptionController.createSubscription);
router.put("/:id", subscriptionController.updateSubscription);

module.exports = router;
