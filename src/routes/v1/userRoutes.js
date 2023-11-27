import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { userController } from "../../controllers/UserController.js";
import fileImage from "../../utils/uploadCloudinary.js";

const router = express.Router();
// [POST] LOGIN
router.post("/login", userController.userAuth);

// [POST] REGISTER
router.post("/", userController.userRegister);

// [GET] PROFILE
router.get("/profile", authMiddleware.protect, userController.getUserProfile);

// [PUT] UPDATE PROFILE
router.put(
  "/profile",
  authMiddleware.protect,
  userController.updateUserProfile
);

router.put(
  "/avatar",
  authMiddleware.protect,
  fileImage.single("file"),
  userController.updateAvatar
);

// [PUT] CHANGE PASSWORD
router.put(
  "/change_password",
  authMiddleware.protect,
  userController.changePassword
);

// [GET] GET ALL USERS
router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.admin,
  userController.getAllUsers
);

router.get("/active_account", userController.activeAccount);

router.post("/forgot_password", userController.forgotPassword);

router.post("/refresh_token", userController.refreshToken);

export const userRouter = router;
