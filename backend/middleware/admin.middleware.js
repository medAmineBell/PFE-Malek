import asyncHandler from "express-async-handler";
import CustomError from "../lib/custom-error.js";

export const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else
    throw new CustomError(401, "Unauthorized: You don't have admin privileges");
});
