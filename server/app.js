import express from "express";
import { config } from "dotenv";
import PaymentRouter from "./routes/PaymentRoutes.js";
import cors from "cors";
import { connectionDB } from "./config/database.js";

export const app = express();

//config
config({path:"./config/config.env"});


//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/api/getkey", (req, res) =>
  res.json({ key: process.env.RAZORPAY_API_KEY }),
);
app.use("/api", PaymentRouter);


