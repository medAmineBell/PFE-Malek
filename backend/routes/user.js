import express from "express";
import {
  createUser,
  deleteUser,
  getAdminStatics,
  getAllUsers,
  getUserById,
  updateImage,
  updateUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
import uploadImg from "../utils/upload/upload-image.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(authorizeUser, authorizeAdmin, createUser)
  .get(authorizeUser, authorizeAdmin, getAllUsers);
router.route("/admin/:id").put(authorizeUser, authorizeAdmin, updateUser);
router.route("/status").get(authorizeUser, getAdminStatics);

router
  .route("/image/:id")
  .put(authorizeUser, uploadImg.single("image"), updateImage);
router
  .route("/:id")
  .get(getUserById)
  .put(authorizeUser, updateUserProfile)
  .delete(authorizeUser, authorizeAdmin, deleteUser);

export default router;
