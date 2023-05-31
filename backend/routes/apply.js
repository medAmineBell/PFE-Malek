import express from "express";
import {
  createApply,
  deleteApply,
  findAll,
  findUserApplies,
  getApplyById,
  sendMailToCandidate,
  updateApply,
} from "../controllers/apply.controller.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
import { authorizeRecuiter } from "../middleware/recuiter.middleware.js";
import { uploadCv } from "../utils/upload/upload-resume.js";

const router = express.Router();

router
  .route("/")
  .get(authorizeUser, authorizeRecuiter, findAll)
  .post(uploadCv.single("file"), authorizeUser, createApply);
router.route("/user").get(authorizeUser, findUserApplies);

router.route("/mail").post(sendMailToCandidate);

router
  .route("/:id")
  .get(authorizeUser, getApplyById)
  .put(authorizeUser, authorizeRecuiter, updateApply)
  .delete(authorizeUser, authorizeRecuiter, deleteApply);

export default router;
