import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get("/", (req, res) => {
  res.render("index", { key: process.env.RAZORPAY_KEY_ID });
  // res.json({status:200,message:'hello world'})
});

// Create order
app.post("/create-order", async (req, res) => {
  const options = {
    amount: 500 * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now()
  };

  const order = await razorpay.orders.create(options);
  console.log(order)
  res.json(order);
});

// Verify payment
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(req.body)

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.send("Payment Verified ✔");
  } else {
    res.send("Payment Verification Failed ❌");
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
