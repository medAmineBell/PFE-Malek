import express from "express";
import {
  createContact,
  deleteContact,
  getContactById,
  getContactsList,
} from "../controllers/contact.controller.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(createContact)
  .get(authorizeUser, authorizeAdmin, getContactsList);

router
  .route("/:id")
  .delete(authorizeUser, authorizeAdmin, deleteContact)
  .get(getContactById);

export default router;
