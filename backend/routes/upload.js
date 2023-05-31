import express from "express";
import uploadImg from "../utils/upload/upload-image.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.route("/image").post(uploadImg.single("image"), uploadImage);
export default router;
