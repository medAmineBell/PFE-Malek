import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Apply from "../models/apply.job.js";
import CustomError from "../lib/custom-error.js";
import { unlink } from "fs";
import NodeCache from "node-cache";

const cache = new NodeCache();

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const pageSize = 9;

  const [users, userCount] = await Promise.all([
    User.find({})
      .skip(pageSize * (page - 1))
      .limit(pageSize),
    User.countDocuments({}),
  ]);

  if (!users) throw new CustomError(404, "users not found");

  res.status(200).json({
    users,
    page: parseInt(page) || 1,
    userCount,
    pages: Math.ceil(userCount / pageSize),
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new CustomError(404, "user not found");

  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) throw new CustomError(404, "user not found");
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.role = role;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const existUser = await User.findOne({ email });

  if (existUser) throw new CustomError(400, "email already exist");

  const user = new User({ firstName, lastName, email, password, role });

  if (!user) throw new CustomError(400, "something went wrong");

  const newUser = await user.save();

  res
    .status(201)
    .json({ message: "User has been created successfully", user: newUser });
  // Your route logic
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) throw new CustomError(404, "user not found");

  if (user) {
    const prevImageUrl = user.image.substring(37);
    //remove the previous image
    unlink(`${process.cwd()}/uploads/images/${prevImageUrl}`, (err) => {
      if (err) console.log(err);
    });
    res.status(200).json({ message: "user has been deleted" });
  } else {
    if (!user) throw new CustomError(400, "something went wrong");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) throw new CustomError(404, "user not found");

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phone = phone;
  user.address = address;
  if (password) user.password = password;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

export const updateImage = asyncHandler(async (req, res) => {
  // const { image } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) throw new CustomError(404, "user not found");

  const prevImageUrl = user.image.substring(37);

  //remove the previous image
  unlink(`${process.cwd()}/uploads/images/${prevImageUrl}`, (err) => {
    if (err) console.log(err);
  });

  user.image = `/${req.file.path}`;

  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
});

export const getAdminStatics = asyncHandler(async (req, res) => {
  let data = cache.get("adminStatics");

  if (!data) {
    const [countUsers, jobCounts, applyCount, accptedApply] = await Promise.all(
      [
        User.countDocuments(),
        Job.countDocuments(),
        Apply.countDocuments(),
        Apply.countDocuments({ status: "success" }),
      ]
    );

    data = {
      countUsers,
      jobCounts,
      applyCount,
      accptedApply,
    };
    cache.set("adminStatics", data, 180); // cache for 180 seconds
  }
  console.log("adminStatics found ");
  res.status(200).json(data);
});
