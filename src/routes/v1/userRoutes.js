import express from "express";
import { authMiddleware } from "~/middleware/authMiddleware";
import { userController } from "~/controllers/userController";

const router = express.Router();
// [POST] GET ALL USERS
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

// [GET] GET ALL USERS
router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.admin,
  userController.getAllUsers
);

export const userRouter = router;
