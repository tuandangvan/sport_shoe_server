import express from "express";
import { authMiddleware } from "~/middleware/authMiddleware";
import { categoryController } from "~/controllers/categoryController";

const router = express.Router();

// [GET] ALL CATEGORIES

router.get("/", categoryController.getAllCategories);
// [GET] SINGLE CATEGORY
router.get(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  categoryController.getSingleCategoryByAdmin
);
// [POST] CREATE CATEGORY
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.admin,
  categoryController.createCategoriesByAdmin
);
// [PUT] UPDATE CATEGORY
router.put(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  categoryController.updateCategoryByAdmin
);
// [DELETE] DELETE CATEGORY
router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  categoryController.deleteCategoryByAdmin
);

export const categoryRouter = router;
