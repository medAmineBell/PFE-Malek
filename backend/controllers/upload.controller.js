import asyncHandler from "express-async-handler";

export const uploadImage = asyncHandler(async (req, res) => {
  res.send(`/${req.file?.path}`);
});
