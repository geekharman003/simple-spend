const cashfreeService = require("../services/cashfreeService");
const Payments = require("../models/paymentModel");
const User = require("../models/userModel");
const processPayment = async (req, res) => {
  const { user } = req;

  const orderId = "order_" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerId = "1";
  const customerPhone = "9999999999";

  try {
    // try tp create order in cashfree
    const paymentSessionId = await cashfreeService.createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    // save the payment info in the database
    await Payments.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
      userId: user.id,
    });

    res.status(200).json({ paymentSessionId, orderId });
  } catch (error) {
    console.error("Error creating order:", error.message);
  }
};

const fetchPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { user } = req;
    const orderStatus = await cashfreeService.getPaymentStatus(orderId);

    if (orderStatus === "Success") {
      await User.update(
        {
          isPremium: true,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    }

    await Payments.update(
      {
        paymentStatus: orderStatus,
      },
      {
        where: {
          orderId,
        },
      }
    );

    res.status(200).json({ orderStatus });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { processPayment, fetchPaymentStatus };
