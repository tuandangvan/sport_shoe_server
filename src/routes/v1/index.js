import express from "express";
import { StatusCodes } from "http-status-codes";
import { categoryRouter } from "../../routes/v1/categoryRoutes.js";
import { contactRouter } from "../../routes/v1/contactRoutes.js";
import { orderRouter } from "../../routes/v1/orderRoutes.js";
import { productRouter } from "../../routes/v1/productRoutes.js";
import { userRouter } from "../../routes/v1/userRoutes.js";
import { brandRouter } from "../../routes/v1/brandRoutes.js";
import { uploadRoute } from "../../routes/v1/uploadRoute.js";
import ImportData from "../../config/importData.js";
import { paymentRoute } from "./paymentRoutes.js";

const router = express.Router();

// Check APIs v1/status
router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "API v1 are ready to use!",
    code: StatusCodes.OK
  });
});

router.use("/import", ImportData);
router.use("/categories", categoryRouter);
router.use("/brands", brandRouter);
router.use("/contact", contactRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/upload", uploadRoute);
router.use("/config", paymentRoute);

export const APIs_V1 = router;
