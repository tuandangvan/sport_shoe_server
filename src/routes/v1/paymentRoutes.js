import express from "express";
import { env } from "../../config/environment.js";

const router = express.Router();
// [POST] LOGIN
router.get("/paypal", (req, res) => {
  res.send(env.PAYPAL_CLIENT_ID);
});
export const paymentRoute = router;
