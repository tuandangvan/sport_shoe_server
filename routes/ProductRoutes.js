const express = require("express");
const { protect, admin } = require("../middleware/Auth");
const productRoute = express.Router();
const {
  getAllProduct,
  getSingleProduct,
  createProductReview,
  deleteProductByAdmin,
  createProductByAdmin,
  updateProductByAdmin,
  getAllProductByAdmin,
  productListCategory,
  filteredProducts,
} = require("../controllers/ProductController");

// ?[DELETE] DELETE PRODUCT ID BY ADMIN
productRoute.delete("/:id/delete", protect, admin, deleteProductByAdmin);

// ?[POST] CREATE PRODUCT BY ADMIN
productRoute.post("/create", protect, admin, createProductByAdmin);

// ?[PUT] GET EDIT PRODUCT ID PAGE BY ADMIN
productRoute.put("/:id", protect, admin, updateProductByAdmin);

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */
productRoute.get("/categories", productListCategory);
// GET ALL PRODUCT BY ADMIN
productRoute.get("/all", protect, admin, getAllProductByAdmin);
// [GET] SINGLE PRODUCT
productRoute.get("/:id", getSingleProduct);

// [POST] REVIEW PRODUCT
productRoute.post("/:id/review", protect, createProductReview);

productRoute.post("/search", filteredProducts);

// [GET] ALL PRODUCT
productRoute.get("/", getAllProduct);

module.exports = productRoute;
