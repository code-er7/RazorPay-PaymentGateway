import { Payment } from "../models/paymentModel.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100), // amount in the smallest currency unit  //this is 500 rs
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({
      success: "true",
      order,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: "false",
      error,
    });
  }
};

export const paymentverification = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const success = generated_signature === razorpay_signature; // Initialize with false

  if (success) {
    //database

    await Payment.create({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.json({
      success,
    });
  }
};
