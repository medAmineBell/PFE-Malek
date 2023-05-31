import express from "express";
import authRoutes from "./auth.js";
import jobsRoutes from "./job.js";
import usersRoutes from "./user.js";
import uploadsRoutes from "./upload.js";
import applyRoutes from "./apply.js";
import contactRoutes from "./contact.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/jobs", jobsRoutes);
router.use("/users", usersRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/apply", applyRoutes);
router.use("/contact", contactRoutes);



export { router as routes };
