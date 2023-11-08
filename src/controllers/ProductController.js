import asyncHandler from "express-async-handler";
import Product from "~/models/productModel";
import Category from "~/models/categoryModel";
import { verify } from "jsonwebtoken";
import { env } from "~/config/environment";
import Order from "~/models/orderModel";

// @desc    get all product
// @route   GET /api/products/
// @access  Public

const getAllProduct = asyncHandler(async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i"
        }
      }
    : {};
  const products = await Product.find({ ...keyword, ...category, status: "Active" });
  if (products) {
    return res.status(200).json(products);
  } else {
    return res.status(400).json({ message: "No Products Available" });
  }
});

const getAllProductByAdmin = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber || 1);
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i"
        }
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword, status: "Active" })
    .populate("category")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ _id: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// ?@desc    ADMIN | DELETE PRODUCT BY ID
// ?@route   DELETE /api/products/:id
// ?@access  Private

const deleteProductByAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

//? @desc    ADMIN | CREATE PRODUCT BY ID
// ?@route   POST /api/products/create
// ?@access  Private
const createProductByAdmin = asyncHandler(async (req, res) => {
  // Declare Object need to be created
  const { productName, price, description, imageUrl, category,brand, typeProduct } = req.body;
  const categoryFound = await Category.findById(category);

  if (!categoryFound) {
    return res.status(400).json({ message: "Category Not Found" });
  }

  // ? Check Exist Product
  const productExist = await Product.findOne({ productName: productName });

  if (productExist) {
    res.status(400);
    throw new Error("Product name already existed");
  } else {
    // Create New Value from Model
    const product = new Product({
      productName,
      price,
      categoryName: categoryFound.categoryName,
      description,
      image: imageUrl,
      typeProduct
    });
    if (product) {
      const createProduct = await product.save();
      if (createProduct) {
        return res.status(201).json(createProduct);
      }
    } else {
      res.status(400).json({ message: "Invalid Category" });
      throw new Error("Invalid Product");
    }
  }
});

const updateProductByAdmin = asyncHandler(async (req, res) => {
  const { productName, price, description, image, categoryId } =
    req.body;
  const product = await Product.findById(req.params.id).populate("category");

  if (product) {
    // if (categoryId) {
    let categoryFound = await Category.findOne({ name: req.body.category });
    // * Update by any object
    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.categoryName = categoryFound.categoryName || product.categoryName;
    const updateProduct = await product.save();
    res.status(201).json(updateProduct);
    // }
  } else {
    res.status(400);
    throw new Error("Product Not Found");
  }
});

// @desc    Get ID Single Product
// @route   GET /api/products/:id
// @access  Public

const getSingleProduct = asyncHandler(async (req, res) => {

  const token = req.header("Authorization").replace("Bearer ", "");
  const decodeToken = verify(token, env.JWT_SECRET);
  const product = await Product.findById(req.params.id);
  let allowReview = false;

  const order = await Order.findOne({user: decodeToken.id, "orderItems.product": product.id})

  if(order) allowReview = true;
  if (product) {
    res.json({product, allowReview: allowReview});
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

// @desc    Create Product Review
// @route   POST /api/products/:id/review
// @access  Private

const createProductReview = asyncHandler(async (req, res) => {
  // *Declare rating and comment in request body
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  // Find already reviewed
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    //* Push req.review in user array
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      timestamps: true
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, b) => b.rating + a, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Reviews added" });
  } else {
    res.status(404);
    throw new Error("Product not Found");
  }
});

const filteredProducts = asyncHandler(async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  Product.find(findArgs)
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found"
        });
      }
      res.json({
        size: data.length,
        data
      });
    });
});

const productListCategory = asyncHandler(async (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(404).json({
        err: "Categories Not Found"
      });
    }
    res.json(categories);
  });
});

export const productController = {
  getAllProduct,
  getSingleProduct,
  createProductReview,
  deleteProductByAdmin,
  createProductByAdmin,
  updateProductByAdmin,
  getAllProductByAdmin,
  productListCategory,
  filteredProducts
};
