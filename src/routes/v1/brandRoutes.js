import express from "express";
import { authMiddleware } from "~/middleware/authMiddleware";
import { brandController } from "~/controllers/brandController";

const router = express.Router();

// [GET] ALL BRANDS

router.get("/", brandController.getAllBrands);
// [GET] SINGLE BRAND
router.get(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  brandController.getSingleBrandByAdmin
);
// [POST] CREATE BRAND
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.admin,
  brandController.createBrandByAdmin
);
// [PUT] UPDATE BRAND
router.put(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  brandController.updateBrandByAdmin
);
// [DELETE] DELETE BRAND
router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  brandController.deleteBrandByAdmin
);

export const brandRouter = router;
