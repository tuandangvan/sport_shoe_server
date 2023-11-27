import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";

// ?@desc    ADMIN | GET ALL BRAND WITHOUT SEARCH AND PAGINATION
// ?@route   GET /api/brands/
// ?@access  Private

const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ status: "Active" });

  if (!brands) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(brands);
});

const createBrandByAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { brandName, imageUrl, origin } = req.body;
    const usedBrand = await Brand.findOne({ brandName: brandName });
    if (usedBrand) {
      res.status(400).json({ message: "Brand already exists" });
    }
    const brandFields = {
      brandName: brandName,
      imageUrl: imageUrl,
      origin: origin,
      status: "Active"
    };

    const newBrand = await new Brand(brandFields).save();
    res.json(newBrand);
  } catch (error) {
    next(error);
  }
});

const deleteBrandByAdmin = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    brand.status = "Deleted";
    await brand.save();
    res.status(201).json({ message: "Deleted successfully brand" });
  } else {
    res.status(404);
    throw new Error("Cannot delete brand");
  }
});

const getSingleBrandByAdmin = asyncHandler(async (req, res) => {
  const singleBrand = await Brand.findById(req.params.id);
  if (singleBrand) {
    res.status(201).json(singleBrand);
  } else {
    res.status(404);
    throw new Error("Brand Cannot Found");
  }
});

const updateBrandByAdmin = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  const { brandName, imageUrl, origin } = req.body;
  const brandNameExist = await Brand.findOne({ brandName: brandName });
  if (brandNameExist && brandNameExist._id.toString() != req.params.id) {
    res.status(400).json({ message: "Brand already exists" });
  }
  if (brand) {
    brand.brandName = brandName || brand.brandName;
    brand.imageUrl = imageUrl || brand.imageUrl;
    brand.origin = origin || brand.origin;

    const updateBrand = await brand.save();
    res.status(201).json(updateBrand);
  } else {
    res.status(400);
    throw new Error("Category Not Found");
  }
});

export const brandController = {
  getAllBrands,
  createBrandByAdmin,
  deleteBrandByAdmin,
  getSingleBrandByAdmin,
  updateBrandByAdmin
};
