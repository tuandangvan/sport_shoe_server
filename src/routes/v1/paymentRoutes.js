import express from "express";

const router = express.Router();
// [POST] LOGIN
router.get("/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
  });
export const paymentRoute = router;
