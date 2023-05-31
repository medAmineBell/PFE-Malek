import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import CustomError from "../lib/custom-error.js";
import User from "../models/user.model.js";

export const authorizeUser = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer"))
    throw new CustomError(
      401,
      "Unauthorized: Missing or invalid authorization header"
    );

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.user._id);

    if (!user) throw new CustomError(401, "Unauthorized: User not found");

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    throw new CustomError(401, "Unauthorized: Invalid token");
  }
});
