const express = require("express");
const categoryRouter = express.Router();
const { protect, admin } = require("../middleware/Auth");
const {
  getAllCategories,
  createCategoriesByAdmin,
  deleteCategoryByAdmin,
  getSingleCategoryByAdmin,
  updateCategoryByAdmin,
} = require("../controllers/CategoryController");

// [GET] ALL CATEGORIES

categoryRouter.get("/", getAllCategories);
// [GET] SINGLE CATEGORY
categoryRouter.get("/:id", protect, admin, getSingleCategoryByAdmin);
// [POST] CREATE CATEGORY
categoryRouter.post("/", protect, admin, createCategoriesByAdmin);
// [PUT] UPDATE CATEGORY
categoryRouter.put("/:id", protect, admin, updateCategoryByAdmin);
// [DELETE] DELETE CATEGORY
categoryRouter.delete("/:id", protect, admin, deleteCategoryByAdmin);
module.exports = categoryRouter;
