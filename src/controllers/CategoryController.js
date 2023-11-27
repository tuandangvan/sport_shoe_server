import asyncHandler from "express-async-handler";
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
// import slugify from "slugify";
// import Product from "../models/productModel";

// ?@desc    ADMIN | GET ALL CATEGORIES WITHOUT SEARCH AND PAGINATION
// ?@route   GET /api/categories/
// ?@access  Private

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: "Active" });

  if (!categories) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(categories);
});

const createCategoriesByAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { categoryName, description } = req.body;
    const usedCategory = await Category.findOne({ categoryName: categoryName });
    if (usedCategory) {
      res.status(400).json({ message: "Category already exists" });
    }

    const categoryFields = {
      categoryName: categoryName,
      description: description,
      status: "Active"
    };

    const newCategory = await new Category(categoryFields).save();
    res.json(newCategory);
  } catch (error) {
    next(error);
  }
});

const deleteCategoryByAdmin = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    const product = await Product.findOne({
      categoryName: category.categoryName
    });
    if (product) {
      res.status(400);
      throw new Error("Cannot delete category");
    }
    category.status = "Deleted";
    await category.save();
    res.status(201).json({ message: "Deleted successfully category" });
  } else {
    res.status(404);
    throw new Error("Cannot delete category");
  }
});

const getSingleCategoryByAdmin = asyncHandler(async (req, res) => {
  const singleCategory = await Category.findById(req.params.id);
  if (singleCategory) {
    res.status(201).json(singleCategory);
  } else {
    res.status(404);
    throw new Error("Category Cannot Found");
  }
});

const updateCategoryByAdmin = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  const { categoryName, description } = req.body;
  const categoryNameExists = await Category.findOne({
    categoryName: categoryName
  });
  if (
    categoryNameExists &&
    categoryNameExists._id.toString() != req.params.id
  ) {
    res.status(400).json({ message: "Category already exists" });
  }
  if (category) {
    category.categoryName = categoryName || category.categoryName;
    category.description = description || category.description;
    const updateCategory = await category.save();
    res.status(201).json(updateCategory);
  } else {
    res.status(400);
    throw new Error("Category Not Found");
  }
});

export const categoryController = {
  getAllCategories,
  createCategoriesByAdmin,
  deleteCategoryByAdmin,
  getSingleCategoryByAdmin,
  updateCategoryByAdmin
};
