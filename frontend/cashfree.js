const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("pay-btn").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const response = await axios.post(
      "http://localhost:3000/pay",
      {},
      {
        headers: { Authorization: token },
      }
    );
    const { paymentSessionId, orderId } = response.data;

    let checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_modal",
    };

    const result = await cashfree.checkout(checkoutOptions);
    if (result.error) {
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status"
      );

      console.log(result.error);
    }

    if (result.redirect) {
      console.log("Payment will be redirected");
    }

    if (result.paymentDetails) {
      console.log("Payment has been completed, Check for Payment Status");
      console.log(result.paymentDetails.paymentMessage);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/payment-status/${orderId}`,
        { headers: { Authorization: token } }
      );
      const { orderStatus } = response.data;
      if (orderStatus === "Success") {
        alert("Transaction is successful");
      } else if (orderStatus === "Pending") {
        alert("Transaction is Pending");
      } else {
        alert("Transaction is Failed");
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});
