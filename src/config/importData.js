import express from "express";
import User from "~/models/userModel";
import { users } from "~/data/userData";
import Product from "~/models/productModel";
import Brand from "~/models/brandModel";
import Category from "~/models/categoryModel";
import { products } from "~/data/productData";
import { categories } from "~/data/categoryData";
import { brands } from "~/data/brandData";
import asyncHandler from "express-async-handler";

const ImportData = express.Router();

// ImportData.post(
//   "/users",
//   asyncHandler(async (req, res) => {
//     await User.remove({});
//     const importUser = await User.insertMany(users);
//     res.send({ importUser });
//   })
// );
// ImportData.post(
//   "/products",
//   asyncHandler(async (req, res) => {
//     await Product.remove({});
//     const importProducts = await Product.insertMany(products);
//     res.send({ importProducts });
//   })
// );
ImportData.post(
  "/init-data",
  asyncHandler(async (req, res) => {
    await User.remove({});
    await User.insertMany(users);

    await Brand.remove({});
    await Brand.insertMany(brands);

    await Category.remove({});
    await Category.insertMany(categories);

    await Product.remove({});
    const productsData = products.map((product) => {
      return {
        ...product,
        countInStock: product.typeProduct.reduce(
          (acc, currentType) => acc + currentType.quantity,
          0
        )
      };
    });
    await Product.insertMany(productsData);
    res.send({ sucss: "Initial data successfully !" });
  })
);

export default ImportData;
