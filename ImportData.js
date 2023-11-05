const express = require("express");
const User = require("./src/models/UserModel");
const users = require("./src/data/users");
const Product = require("./src/models/ProductModel");
const products = require("./src/data/Products");
const ImportData = express.Router();
const asyncHandler = require("express-async-handler");

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

module.exports = ImportData;
