const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authentication = require("../middleware/auth");

router.get(
  "/",
  authentication.authenticateUser,
  expenseController.loadAllExpenses
);
router.post(
  "/addexpense",
  authentication.authenticateUser,
  expenseController.addExpense
);
router.delete(
  "/delete/:id",
  authentication.authenticateUser,
  expenseController.deleteExpense
);

module.exports = router;
