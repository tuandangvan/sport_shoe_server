import express from "express";
import { uploadController } from "~/controllers/uploadController";
import { authMiddleware } from "~/middleware/authMiddleware";
import fileImage from "~/utils/uploadCloudinary";

const route = express.Router();

// ?[POST] CREATE PRODUCT BY ADMIN
route.post(
  "/single",
  authMiddleware.protect,
  authMiddleware.admin,
  fileImage.single("file"),
  uploadController.uploadSingle
);

route.post(
    "/multiple",
    authMiddleware.protect,
    authMiddleware.admin,
    fileImage.array('file', 5),
    uploadController.uploadMulti
  );

// router.post("/single", fileImage.single('file') , uploadController.uploadSingle);
// router.post("/multi-image", fileImage.array('file', 5) , uploadController.uploadMulti);

export const uploadRoute = route;
