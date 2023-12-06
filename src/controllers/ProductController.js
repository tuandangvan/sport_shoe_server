import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import Brand from "../models/brandModel.js";
import { verify } from "jsonwebtoken";
import { env } from "../config/environment.js";
import Order from "../models/OrderModel.js";
import reviewModel from "../models/reviewModel.js";

// @desc    get all product
// @route   GET /api/products/
// @access  Public

const getAllProduct = asyncHandler(async (req, res) => {
  const categoryName = req.query.categoryName
    ? { categoryName: req.query.categoryName }
    : {};
  const brandName = req.query.brandName
    ? { brandName: req.query.brandName }
    : {};
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i"
        }
      }
    : {};
  const products = await Product.find({
    ...keyword,
    ...categoryName,
    ...brandName,
    status: "Active"
  });
  if (products) {
    return res.status(200).json(products);
  } else {
    return res.status(400).json({ message: "No Products Available" });
  }
});

const getAllProductByAdmin = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber || 1);
  const categoryName = req.query.categoryName
    ? {
        categoryName: req.query.categoryName
      }
    : {};

  const keyword = req.query.keyword
    ? {
        productName: {
          $regex: req.query.keyword,
          $options: "i"
        }
      }
    : {};
  const count = await Product.countDocuments({
    ...keyword,
    ...categoryName,
    status: "Active"
  });
  const products = await Product.find({
    ...keyword,
    ...categoryName,
    status: "Active"
  })
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
    product.status = "Deleted";
    await product.save();
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
  const {
    productName,
    price,
    description,
    imageUrl,
    categoryName,
    brandName,
    typeProduct
  } = req.body;
  const categoryFound = await Category.findOne({ categoryName: categoryName });
  if (!categoryFound) {
    return res.status(400).json({ message: "Category Not Found" });
  }

  const brandFound = await Brand.findOne({ brandName: brandName });
  if (!brandFound) {
    return res.status(400).json({ message: "Brand Not Found" });
  }

  // ? Check Exist Product
  const productExist = await Product.findOne({ productName: productName });

  if (productExist) {
    res.status(400);
    throw new Error("Product name already existed");
  } else {
    const countInStock = typeProduct.reduce(
      (totalQuantity, itemCurrent) => itemCurrent.quantity + totalQuantity,
      0
    );
    // Create New Value from Model

    // var countInStock = 0;
    // typeProduct.forEach((item) => {
    //   countInStock += item.quantity;
    // });

    const product = new Product({
      productName,
      image: imageUrl,
      description,
      price,
      countInStock,
      categoryName: categoryFound.categoryName,
      brandName: brandFound.brandName,
      typeProduct,
      status: "Active"
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
  const {
    productName,
    price,
    description,
    imageUrl,
    categoryName,
    brandName,
    typeProduct
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const categoryFound = await Category.findOne({
      categoryName: categoryName
    });
    if (!categoryFound) {
      return res.status(400).json({ message: "Category Not Found" });
    }
    const brandFound = await Brand.findOne({ brandName: brandName });
    if (!brandFound) {
      return res.status(400).json({ message: "Brand Not Found" });
    }
    // * Update by any object
    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = imageUrl || product.image;
    product.categoryName = categoryFound.categoryName || product.categoryName;
    product.typeProduct = typeProduct || product.typeProduct;
    const updateProduct = await product.save();
    res.status(201).json(updateProduct);
  } else {
    res.status(400);
    throw new Error("Can not update product");
  }
});

const handlerTypeProduct = (product) => {
  const typeProduct = product.typeProduct;

  //filter color
  const uniqueColors = new Set();
  typeProduct.forEach((item) => {
    if (item.color) {
      uniqueColors.add(item.color);
    }
  });
  const colorArray = Array.from(uniqueColors);

  var type = [];

  colorArray.forEach((itemColor) => {
    var color = {};
    typeProduct.forEach((item) => {
      if (item.color == itemColor) {
        var size = { size: item.size, quantity: item.quantity };
        if (!color[itemColor]) {
          color[itemColor] = [];
        }
        color[itemColor].push(size);
      }
    });
    type.push(color);
  });

  return type;
};

const handlerTypeProduct2 = (product) => {
  const typeProduct = product.typeProduct;

  //filter color
  const uniqueColors = new Set();
  typeProduct.forEach((item) => {
    if (item.color) {
      uniqueColors.add(item.color);
    }
  });
  const colorArray = Array.from(uniqueColors);

  var type = [];

  colorArray.forEach((itemColor) => {
    var sizes = [];
    typeProduct.forEach((item) => {
      if (item.color == itemColor) {
        var size = { size: item.size, quantity: item.quantity };
        sizes.push(size);
      }
    });
    type.push({ color: itemColor, sizes: sizes });
  });

  return type;
};
// @desc    Get ID Single Product
// @route   GET /api/products/:id
// @access  Public

const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  let allowReview = false;
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    const decodeToken = verify(token, env.JWT_SECRET);
    const order = await Order.findOne({
      user: decodeToken.id,
      "orderItems.product": product.id
    });
    if (order) {
      if (order.status == 3) allowReview = true;
    }
  }

  const typeProduct = handlerTypeProduct2(product);

  await product.populate("reviews.reviewId");

  if (product) {
    res.json({
      product: {
        id: product.id,
        productName: product.productName,
        image: product.image,
        description: product.description,
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews,
        price: product.price,
        countInStock: product.countInStock,
        categoryName: product.categoryName,
        brandName: product.brandName,
        status: product.status,
        typeProduct: typeProduct,
        sold: product.sold,
        allowReview: allowReview
      }
    });
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
    //   const alreadyReviewed = product.reviews.find(
    //     (r) => r.user.toString() === req.user._id.toString()
    //   );
    //   if (alreadyReviewed) {
    //     res.status(400);
    //     throw new Error("Product already reviewed");
    //   }
    //* Push req.review in user array
    const review = new reviewModel({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      status: "true",
      timestamps: true
    });

    const reviewd = await review.save();
    product.reviews.push({ reviewId: reviewd.id });
    await product.save();

    const product_reset = await Product.findById(req.params.id);

    await product_reset.populate("reviews.reviewId");

    product_reset.numReviews = product.reviews.length;
    product_reset.rating =
      product_reset.reviews.reduce((a, b) => b.reviewId.rating + a, 0) /
      product_reset.reviews.length;

    await product_reset.save();
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

  // for (let key in req.body.filters) {
  //   if (req.body.filters[key].length > 0) {
  //     if (key === "price") {
  //       findArgs[key] = {
  //         $gte: req.body.filters[key][0],
  //         $lte: req.body.filters[key][1]
  //       };
  //     } else {
  //       findArgs[key] = req.body.filters[key];
  //     }
  //   }
  // }

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      switch (key) {
        case "price":
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
          };
          break;
        case "categoryName":
          findArgs[key] = { $in: req.body.filters[key] };
          break;
        case "brandName":
          findArgs[key] = { $in: req.body.filters[key] };
          break;
        default:
          break;
      }
    }
  }
  findArgs = { $and: [{ ...findArgs }] };
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

const findProductByKeyword = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;

  const product = await Product.find({
    $or: [
      { productName: { $regex: keyword, $options: "i" } },
      { brandName: { $regex: keyword, $options: "i" } },
      { categoryName: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }
    ]
  });
  res.status(200).json({ product });
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
  filteredProducts,
  findProductByKeyword
};
