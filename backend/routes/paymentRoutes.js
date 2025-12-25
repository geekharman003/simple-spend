const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentContoller");
const authentication = require("../middleware/auth");

router.post(
  "/pay",
  authentication.authenticateUser,
  paymentController.processPayment
);
router.get(
  "/payment-status/:orderId",
  authentication.authenticateUser,
  paymentController.fetchPaymentStatus
);
module.exports = router;
