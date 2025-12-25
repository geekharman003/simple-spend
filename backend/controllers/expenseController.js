const { raw } = require("express");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const { user } = req;

    if (!amount || !description || !category) {
      return res
        .status(400)
        .send("amount,description and category are required");
    }

    const fetchedUser = await User.findByPk(user.id, { raw: true });

    const prevTotalExpense = fetchedUser.totalExpense;
    const newTotalExpense = prevTotalExpense + Number(amount);

    await User.update(
      {
        totalExpense: newTotalExpense,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    // console.log(prevTotalExpense);

    // User.update({totalExpense:})

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        userId: req.user.id,
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
    const { user } = req;

    const fetchedUser = await User.findByPk(user.id, { raw: true });
    const expense = await Expense.findByPk(id, { raw: true });

    const amountToDelete = expense.amount;
    const prevTotalExpense = fetchedUser.
    totalExpense;
    // calculating the updated expense for the user
    const newTotalExpense = prevTotalExpense - amountToDelete;


    await User.update(
      { totalExpense: newTotalExpense },
      {
        where: {
          id: user.id,
        },
      }
    );

    const expenseToDelete = await Expense.destroy({
      where: {
        id,
      },
    });

    if (!expenseToDelete) {
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
    const { user } = req;
    const expenses = await Expense.findAll({
      where: {
        userId: user.id,
      },
    });

    const fetchedUser = await User.findByPk(user.id, { raw: true });
    const isPremiumUser = fetchedUser.isPremium;

    if (expenses.length === 0) {
      return res
        .status(404)
        .send({ message: "no expense found", isPremiumUser });
    }

    res.status(200).json({ expenses, isPremiumUser });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { addExpense, deleteExpense, loadAllExpenses };
