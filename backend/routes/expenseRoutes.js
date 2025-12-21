const expenseController = require("../controllers/expenseController");
const express = require("express");
const router = express.Router();

router.get("/", expenseController.loadAllExpenses);
router.post("/addexpense", expenseController.addExpense);
router.delete("/delete/:id", expenseController.deleteExpense);

module.exports = router;
