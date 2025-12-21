const express = require("express");
const app = express();
const db = require("./utils/db-connection");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const cors = require("cors");
const path = require("path");
const PORT = 3000;

app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
