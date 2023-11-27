import { authMiddleware } from "../../middleware/authMiddleware.js";
import express from "express";
import { productController } from "../../controllers/ProductController.js";

const route = express.Router();

// ?[DELETE] DELETE PRODUCT ID BY ADMIN
route.delete(
  "/:id/delete",
  authMiddleware.protect,
  authMiddleware.admin,
  productController.deleteProductByAdmin
);

// ?[POST] CREATE PRODUCT BY ADMIN
route.post(
  "/create",
  authMiddleware.protect,
  authMiddleware.admin,
  productController.createProductByAdmin
);

// ?[PUT] GET EDIT PRODUCT ID PAGE BY ADMIN
route.put(
  "/:id",
  authMiddleware.protect,
  authMiddleware.admin,
  productController.updateProductByAdmin
);

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */
route.get("/categories", productController.productListCategory);
// GET ALL PRODUCT BY ADMIN
route.get(
  "/all",
  authMiddleware.protect,
  authMiddleware.admin,
  productController.getAllProductByAdmin
);
// [GET] SINGLE PRODUCT
route.get("/:id", productController.getSingleProduct);

// [POST] REVIEW PRODUCT
route.post(
  "/:id/review",
  authMiddleware.protect,
  productController.createProductReview
);

// Filter product on Client
route.post("/search", productController.filteredProducts);

// [GET] ALL PRODUCT
route.get("/", productController.getAllProduct);

route.post("/find", productController.findProductByKeyword);
export const productRouter = route;
