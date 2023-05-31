import asyncHandler from "express-async-handler";
import CustomError from "../lib/custom-error.js";
import User from "../models/user.model.js";
import { generateToken, getUserData } from "../utils/token.js";
import jwt from "jsonwebtoken";

/**
 * Handle user registration request.
 * @route POST /auth
 * @access Public
 * @returns {Object} JSON response
 */
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existUser = await User.findOne({ email });

  if (existUser) throw new CustomError(400, "email already exist");

  const user = new User({ firstName, lastName, email, password });

  if (!user) throw new CustomError(400, "something went wrong");

  const newUser = await user.save();

  const userInfo = getUserData(newUser);

  const token = generateToken({
    user: userInfo,
    key: process.env.ACCESS_TOKEN_SECRET,
    time: "4h",
  });
  //

  const refreshToken = generateToken({
    user: userInfo,
    key: process.env.REFRESH_TOKEN_SECRET,
    time: "2d",
  });
  if (!token) throw new CustomError(403, "no token");

  res.cookie("token", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https,
    sameSite: "none", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.status(200).json({ token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new CustomError(404, "email does not exist");

  if (!(await user.comparePassword(password)))
    throw new CustomError(404, "Wrong credentials ");

  const userInfo = getUserData(user);

  const token = generateToken({
    user: userInfo,
    key: process.env.ACCESS_TOKEN_SECRET,
    time: "4h",
  });
  //

  const refreshToken = generateToken({
    user: userInfo,
    key: process.env.REFRESH_TOKEN_SECRET,
    time: "2d",
  });

  if (!token) throw new CustomError(403, "no token");

  res.cookie("token", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https,
    sameSite: "none", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.status(200).json({ token: token });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) throw new CustomError(403, "no token");

  const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decode.user._id);

  const accessToken = generateToken({
    user,
    key: process.env.ACCESS_TOKEN_SECRET,
    time: "4h",
  });

  return res.status(200).json({ token: accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) throw new CustomError(403, "no token");

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.json({ message: "Cookie cleared" });
});
