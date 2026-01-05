document.getElementById("payBtn").onclick = async function () {
  const order = await fetch("/create-order", {
    method: "POST",
  }).then((res) => res.json());

  const options = {
    key: window.RAZORPAY_KEY,
    amount: order.amount,
    currency: "INR",
    name: "Demo Store",
    description: "Test Payment",
    order_id: order.id,

    // 🔥 Forces Razorpay to show mock bank page
    method: {
      netbanking: true,
      card: true,
      upi: true,
      wallet: true,
    },

    handler: async function (response) {
      const verify = await fetch("/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      }).then((res) => res.text());

      alert(verify);
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
