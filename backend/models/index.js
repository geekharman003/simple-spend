const User = require("./userModel");
const Expense = require("./expenseModel");
const Payments = require("./paymentModel");
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payments);
Payments.belongsTo(User);

module.exports = { User, Expense, Payments };
