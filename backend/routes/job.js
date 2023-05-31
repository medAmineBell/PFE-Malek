import express from "express";
import {
  adminFilterJobs,
  adminUpdateJob,
  createJob,
  deleteJob,
  filterJobs,
  findAllRecruiterJobs,
  getAllJobs,
  getJobById,
  updateJob,
} from "../controllers/job.controller.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
import { authorizeRecuiter } from "../middleware/recuiter.middleware.js";
import { createJobValidation } from "../utils/validations/job.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";
import validation from "../middleware/validation.middleware.js";
import uploadImg from "../utils/upload/upload-image.js";

const router = express.Router();

router
  .route("/")
  .post(
    authorizeUser,
    authorizeRecuiter,
    uploadImg.single("image"),
    createJobValidation,
    validation,
    createJob
  )
  .get(getAllJobs);
router.route("/filter").get(filterJobs);
router.route("/recruiter").get(authorizeUser, findAllRecruiterJobs);
router.route("/admin/:id").put(authorizeUser, authorizeAdmin, adminUpdateJob);
router.route("/admin").get(authorizeUser, authorizeAdmin, adminFilterJobs);

router
  .route("/:id")
  .get(getJobById)
  .delete(authorizeUser, authorizeRecuiter, deleteJob)
  .patch(authorizeUser, authorizeRecuiter, updateJob);

export default router;
