const db = require("./utils/db-connection");
const express = require("express");
const app = express();
const cors = require("cors");
const models = require("./models");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentsRoutes = require("./routes/paymentRoutes");
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/", paymentsRoutes);

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });  