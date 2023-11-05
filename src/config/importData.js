import express from "express";
import User from "~/models/userModel";
import { users } from "~/data/userData";
import Product from "~/models/productModel";
import { products } from "~/data/productData";
import asyncHandler from "express-async-handler";

const ImportData = express.Router();

ImportData.post(
  "/users",
  asyncHandler(async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);
ImportData.post(
  "/products",
  asyncHandler(async (req, res) => {
    await Product.remove({});
    const importProducts = await Product.insertMany(products);
    res.send({ importProducts });
  })
);

export default ImportData;
