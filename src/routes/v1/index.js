import express from "express";
import { StatusCodes } from "http-status-codes";
import { categoryRouter } from "~/routes/v1/categoryRoutes";
import { contactRouter } from "~/routes/v1/contactRoutes";
import { oAuth2Router } from "~/routes/v1/oAuth2Routes";
import { orderRouter } from "~/routes/v1/orderRoutes";
import { productRouter } from "~/routes/v1/productRoutes";
import { userRouter } from "~/routes/v1/userRoutes";
import { brandRouter } from "~/routes/v1/brandRoutes";
import { uploadRoute } from "~/routes/v1/uploadRoute";
import ImportData from "~/config/importData";
import { paymentRoute } from "./paymentRoutes";

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
router.use("/oauth2", oAuth2Router);
router.use("/orders", orderRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/upload", uploadRoute);
router.use("/config", paymentRoute);

export const APIs_V1 = router;
