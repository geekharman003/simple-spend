const expenseController = require("../controllers/expenseController");
const authentication = require("../middleware/auth");
const express = require("express");
const router = express.Router();

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
  "/delete/",
  authentication.authenticateUser,
  expenseController.deleteExpense
);

module.exports = router;
