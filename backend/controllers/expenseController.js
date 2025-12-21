const Expense = require("../models/expenseModel");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    if (!amount || !description || !category) {
      return res
        .status(400)
        .send("amount,description and category are required");
    }

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
      },
      {
        raw: true,
      }
    );

    if (!expense) {
      throw new Error("error creating entry in database");
    }

    res.status(201).json(expense.toJSON());
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.destroy({
      where: {
        id,
      },
    });

    if (!expense) {
      return res.status(404).send("expense not found");
    }

    res.status(200).json({
      message: "expense deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loadAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ raw: true });
    if (expenses.length === 0) {
      return res.status(404).send("no expense found");
    }

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { addExpense, deleteExpense, loadAllExpenses };
