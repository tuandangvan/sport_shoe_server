import asyncHandler from "express-async-handler";
import User from "~/models/userModel";
import { generateToken } from "~/utils/tokenUtils";
import { env } from "~/config/environment";
import jwt from "jsonwebtoken";
import { emailSender } from "~/middleware/mailMiddleware";

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
      data: {
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
  } else if (user && user.status === "Peding") {
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
  const { refreshToken, email } = req.body;

  const user = await User.findOne({ email });
  const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
  if (
    user &&
    decoded.id === user._id &&
    user.status === "Active" &&
    decoded.exp > Date.now() / 1000
  ) {
    const accessToken = generateToken.generateAccessToken(user._id);
    res.json(accessToken);
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
    status: "Peding",
    codeConfirmMail: token
  });

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

export const userController = {
  userAuth,
  userRegister,
  refreshToken,
  getUserProfile,
  changePassword,
  updateUserProfile,
  getAllUsers,
  getAllUsersByAdmin
};
