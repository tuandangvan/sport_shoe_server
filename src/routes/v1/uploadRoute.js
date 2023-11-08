import express from "express";
import { uploadController } from "~/controllers/uploadController";
import { authMiddleware } from "~/middleware/authMiddleware";
import fileImage from "~/utils/uploadCloudinary";

const route = express.Router();

// ?[POST] POST SINGLE IMAGE
route.post(
  "/single",
  authMiddleware.protect,
  fileImage.single("file"),
  uploadController.uploadSingle
);

// ?[POST] POST MULTIPLE IMAGE
route.post(
  "/multiple",
  authMiddleware.protect,
  fileImage.array("file", 5),
  uploadController.uploadMulti
);

export const uploadRoute = route;
