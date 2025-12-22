const User = require("./userModel");
const Expense = require("./expenseModel");

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = { User, Expense };
