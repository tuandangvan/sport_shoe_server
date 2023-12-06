import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken } from "../utils/tokenUtils.js";
import { env } from "../config/environment.js";
import jwt from "jsonwebtoken";
import { emailSender } from "../middleware/mailMiddleware.js";

// @desc    Auth user & get a token
// @route   POST /api/users/login
// @access  Public

const userAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (
    user &&
    (await user.matchPassword(password)) &&
    user.status === "Active"
  ) {
    res.json({
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        password: user.password,
        avatarUrl: user.avatarUrl,
        gender: user.gender,
        isAdmin: user.isAdmin,
        googleId: user.googleId,
        status: user.status,
        createdAt: user.createdAt
      },
      accessToken: generateToken.generateAccessToken(user._id),
      refreshToken: generateToken.generateRefreshToken(user._id)
    });
  } else if (user && user.status === "Pending") {
    res.status(402);
    throw new Error("Account is not active yet");
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @desc    Get new access token
// @route   POST /api/users/refreshtoken
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded.id });

  if (
    user &&
    decoded.id === user._id.toString() &&
    user.status === "Active" &&
    decoded.exp > Date.now() / 1000
  ) {
    const accessToken = generateToken.generateAccessToken(user._id);
    res.json({ success: true, accessToken });
  } else {
    res.status(401);
    throw new Error("Refresh token is out of date");
  }
});

// @desc    Register user & get a token
// @route   POST /api/users
// @access  Public

const userRegister = asyncHandler(async (req, res) => {
  // ! CHECK EXISTING USER
  const { name, email, password } = req.body;

  if (email == "" || password == "") {
    res.status(400);
    throw new Error("Email or password not allow null!");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const token = generateToken.generateUUID();
  // * Create USER
  const user = await User.create({
    name,
    email,
    password,
    status: "Pending",
    codeConfirmMail: token,
    expiredCodeConfirmMail: new Date(Date.now() + 10 * 60000)
  });
  console.log(user);

  if (user) {
    emailSender.sendConfirmMail({ email, message: token });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      password: user.password,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      isAdmin: user.isAdmin,
      googleId: user.googleId,
      status: user.status,
      createdAt: user.createdAt
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
      address: user.address,
      phoneNumber: user.phoneNumber,
      password: user.password,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      isAdmin: user.isAdmin,
      googleId: user.googleId,
      status: user.status,
      createdAt: user.createdAt
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
    user.address = req.body.address || user.address;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.gender = req.body.gender || user.gender;
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      password: user.password,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      isAdmin: user.isAdmin,
      googleId: user.googleId,
      status: user.status,
      createdAt: user.createdAt
    });
  } else {
    res.status(401);
    throw new Error("User Not Found");
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  let avatarUrl = null;
  try {
    if (req.file) {
      avatarUrl = req.file.path;
    } else {
      res.status(401);
      throw new Error("Can't upload avatar!");
    }
  } catch (error) {
    res.status(401);
    throw new Error("Can't upload avatar!");
  }

  const user = await User.findById(req.user._id);
  if (user) {
    user.avatarUrl = avatarUrl || user.avatarUrl;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      password: user.password,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      isAdmin: user.isAdmin,
      googleId: user.googleId,
      status: user.status,
      createdAt: user.createdAt
    });
  } else {
    res.status(401);
    throw new Error("User Not Found");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, newPassword } = req.body;
  if (user) {
    const isMatch = await user.matchPassword(oldPassword);
    if (isMatch) {
      user.password = newPassword;
      await user.save();
      res.json({
        message: "Change password successfully"
      });
    } else {
      res.status(401);
      throw new Error("Old password is incorrect");
    }
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
          $options: "i"
        }
      }
    : {};
  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ _id: -1 });
  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789^&%*#@";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Email Not Found");
  } else {
    const newPassword = generatePassword(8);
    user.password = newPassword;
    await user.save();
    emailSender.sendForgotPassword({ email, newPassword });
    res.status(200).json({
      message: "An email has been sent"
    });
  }
});

const activeAccount = asyncHandler(async (req, res) => {
  const { token, email } = req.query;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Email Not Found");
  }
  if (user.codeConfirmMail === token && user.status === "Pending") {
    if (user.expiredCodeConfirmMail < Date.now()) {
      res.status(304);
      throw new Error("Token is expired !");
    }
    user.status = "Active";
    await user.save();
    res.status(200).json({
      message: "Account actived successfully !"
    });
  } else {
    res.status(407);
    throw new Error("Token is not correct !");
  }
});

export const userController = {
  userAuth,
  userRegister,
  refreshToken,
  getUserProfile,
  changePassword,
  updateUserProfile,
  getAllUsers,
  getAllUsersByAdmin,
  updateAvatar,
  forgotPassword,
  activeAccount
};
