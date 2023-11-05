const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../utils/generateToken");

// @desc    Auth user & get a token
// @route   POST /api/users/login
// @access  Public

const userAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @desc    Register user & get a token
// @route   POST /api/users
// @access  Public

const userRegister = asyncHandler(async (req, res) => {
  // ! CHECK EXISTING USER
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // * Create USER
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @desc    Get User profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(401);
    throw new Error("User Not Found");
  }
});

// @desc    Update User profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      createdAt: updateUser.createdAt,
      token: generateToken(updateUser._id),
    });
  } else {
    res.status(401);
    throw new Error("User Not Found");
  }
});

//* @desc    Get All Users
//* @route   GET /api/users/
//* @access  Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//* @desc    Get All Users By Admin
//* @route   GET /api/users/
//* @access  Private
const getAllUsersByAdmin = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber || 1);
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ _id: -1 });
  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

module.exports = {
  userAuth,
  userRegister,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getAllUsersByAdmin,
};
