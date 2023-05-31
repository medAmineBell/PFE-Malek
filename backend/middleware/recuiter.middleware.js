import expressAsyncHandler from "express-async-handler";
import CustomError from "../lib/custom-error.js";

export const authorizeRecuiter = expressAsyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Recruiter") {
    next();
  } else
    throw new CustomError(
      401,
      "Unauthorized: You don't have Recruiter privileges"
    );
});
