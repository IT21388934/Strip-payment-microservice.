require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.test = (req, res) => {
  res.send("Strip gateway controller is working!");
};

exports.paymentGateway = async (req, res) => {
  const { product, successEndPoint, cancelEndPoint } = req.body;
  console.log(product, successEndPoint, cancelEndPoint);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}${successEndPoint}`,
      cancel_url: `${process.env.CLIENT_URL}${cancelEndPoint}`,
    });

    console.log(session.url);

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
