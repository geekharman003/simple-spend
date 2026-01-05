const { stringify } = require("csv-stringify/sync");
const assert = require("assert");

const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const loadLeaderBorad = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["name", "totalExpenses"],
      order: [["totalExpenses", "DESC"]],
      raw: true,
    });

    if (!users) {
      return res.status(404).send("no user found");
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const downloadExpenses = async (req, res) => {
  try {
    const { user } = req;
    const expenses = await Expense.findAll({
      attributes: ["amount", "description", "category"],
      where: {
        userId: user.id,
      },
      raw: true,
    });

    let output = null;

    output = stringify(expenses, {
      header: true,
      
      columns: ["amount", "description", "category"],
    });

    res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

module.exports = { loadLeaderBorad, downloadExpenses };
