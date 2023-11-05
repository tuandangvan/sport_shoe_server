const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");
const slugify = require("slugify");
const Product = require("../models/ProductModel");
// ?@desc    ADMIN | GET ALL CATEGORIES WITHOUT SEARCH AND PAGINATION
// ?@route   GET /api/categories/
// ?@access  Private

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate("product");

  if (!categories) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(categories);
});

const createCategoriesByAdmin = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const usedCategory = await Category.findOne({ name: name });
    if (usedCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;

    const newCategory = await new Category(categoryFields).save();
    res.json(newCategory);
  } catch (error) {
    return res.status(400).json({ message: "Category couldn't be created" });
  }
});
const deleteCategoryByAdmin = asyncHandler(async (req, res) => {
  const categoryId = await Category.findById(req.params.id);

  if (categoryId) {
    res.status(201).json({ message: "Deleted successfully category" });
    await categoryId.remove();
  } else {
    res.status(404);
    throw new Error("Cannot delete category");
  }
});

const getSingleCategoryByAdmin = asyncHandler(async (req, res) => {
  const singleCategory = await Category.findById(req.params.id).populate(
    "product"
  );
  if (singleCategory) {
    res.status(201).json(singleCategory);
  } else {
    res.status(404);
    throw new Error("Category Cannot Found");
  }
});

const updateCategoryByAdmin = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  const { name, description } = req.body;
  if (category) {
    category.name = name || category.name;
    category.slug = name || category.name;
    category.description = description || category.description;
    const updateCategory = await category.save();
    res.status(201).json(updateCategory);
  } else {
    res.status(400);
    throw new Error("Category Not Found");
  }
});

module.exports = {
  getAllCategories,
  createCategoriesByAdmin,
  deleteCategoryByAdmin,
  getSingleCategoryByAdmin,
  updateCategoryByAdmin,
};
