import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import loginLimiter from "../middleware/limite-logger.middleware.js";

const router = express.Router();

router.route("/").post(register);
router.route("/login").post(loginLimiter, login);
router.route("/refresh").get(refreshToken);
router.route("/logout").get(logout);

export default router;
