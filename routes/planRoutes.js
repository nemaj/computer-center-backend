const express = require("express");
const planController = require("../controllers/planController");

const router = express.Router();

router.post("/", planController.createPlan);
router.get("/", planController.getPlans);
router.get("/:id", planController.getPlan);
router.put("/:id", planController.updatePlan);
router.delete("/:id", planController.deletePlan);

module.exports = router;
