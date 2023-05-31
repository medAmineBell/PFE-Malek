import asyncHandler from "express-async-handler";
import CustomError from "../lib/custom-error.js";
import Job from "../models/job.model.js";
import Apply from "../models/apply.job.js";
import { unlink } from "fs";
import { sendMail } from "../utils/sendmail.js";

export const createApply = asyncHandler(async (req, res) => {
  const { jobId, letter, diploma,age,experience,spokenLanguage,formations } = req.body;

  const job = await Job.findById(jobId).populate("applies");

  const alreadyApplied = job.applies.find(
    (a) => a.user.toString() === req.user._id.toString()
  );

  if (alreadyApplied) {
    throw new CustomError(401, "You Already apply on this job");
  }

  const newApply = {
    user: req.user._id,
    job: jobId,
    diploma,
    age,
    experience,
    spokenLanguage,
    formations,
    letter,
    resume: `${req.file.path}`,
  };

  const apply = new Apply(newApply);

  if (!apply) throw new CustomError(400, "something went wrong");

  await apply.save();
  job.applies.push(apply);
  await job.save();
  res.status(201).json(apply);
});

export const findUserApplies = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = parseInt(req.query.page) || 1;

  const appliesCount = await Apply.countDocuments({ user: req.user._id });
  const applies = await Apply.find({ user: req.user._id })

    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .populate("user")
    .populate("job");

  if (applies) {
    return res.json({
      applies,
      page,
      appliesCount,
      pages: Math.ceil(appliesCount / pageSize),
    });
  } else {
    throw new CustomError(404, "applies not found");
  }
});

export const getApplyById = asyncHandler(async (req, res) => {
  const apply = await Apply.findById(req.params.id).populate("user job");

  if (!apply) throw new CustomError(404, "apply not found");

  res.status(200).json(apply);
});
// //vooir bin 
// export const filterApplies = asyncHandler(async (req, res) => {
//   const { experience, formations, spokenLanguage, page = 1, search = "" } = req.query;
// //test123 recruteur jdid
//   // Creating a cache key based on the search query and filters
//   const cacheKey = `jobs_${experience}_${formations}_${spokenLanguage}_${search}_${page}`;

//   // Check if products are in cache
//   const cachedProducts = cache.get(cacheKey);
//   if (cachedProducts) {
//     // Return products from cache
//     console.log("applies_ Cache Found");
//     return res.json(cachedProducts);
//   }

//   try {
//     // Construct the `where` clause for the Mongoose query based on the provided parameters
//     const where = { title: { $regex: search, $options: "i" } };

//     const filters = [];
//     if (experience) filters.push({ experience });
//     if (formations) filters.push({ formations });
//     if (spokenLanguage) filters.push({ spokenLanguage });

//     if (filters.length > 0) {
//       where.$or = filters;
//     }

//     // Use `Promise.all` to run multiple Mongoose queries in parallel
//     const [applies, jobCount] = await Promise.all([
//       Applies.find(where)
//         .skip((page - 1) * 9)
//         .limit(9),
//       Applies.countDocuments(where),
//     ]);

//     const [experience, formations, spokenLanguage] = await Promise.all([
//       Applies.find({}).distinct("experience"),
//       Applies.find({}).distinct("formations"),
//       Applies.find({}).distinct("spokenLanguage"),
//     ]);

//     const result = {
//       applies,
//       experience,
//       formations,
//       appliesCount,
//       spokenLanguage,
//       page: parseInt(page),
//       pages: Math.ceil(jobCount / 9),
//     };

//     res.status(200).json(result);

//     // Store jobs in cache for 5 minutes
//     cache.set(
//       cacheKey,
//       result,
//       60 * 5 //5min
//     );
//   } catch (error) {
//     console.error(error);
//     CustomError(500, "Internal Server Error");
//   }
// });
export const updateApply = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const apply = await Apply.findById(req.params.id).populate("user job");

  if (!apply) throw new CustomError(404, "apply not found");

  apply.status = status;

  if (status === "rejected") {
    const companyName = apply?.job.companyName;
    sendMail({
      email: apply.user.email,
      subject: `Your application at ${companyName}`,
      text: "",
      username: apply.user.firstName,
      jobTitle: apply.job.title,
      companyName,
      date: "",
      isAccpeted: false,
    });
  }

  await apply.save();

  res.status(200).json(apply);
});

export const deleteApply = asyncHandler(async (req, res) => {
  const apply = await Apply.findById(req.params.id);

  if (!apply) throw new CustomError(404, "apply not found");

  const deletedApply = await apply.remove();

  if (deletedApply) {
    const prevResumeUrl = apply.resume.substring(37);
    // Remove the previous resume
    unlink(`${process.cwd()}/uploads/resumes/${prevResumeUrl}`, (err) => {
      if (err) console.log(err);
    });
    res.status(200).json({ message: "apply has been deleted" });
  } else {
    throw new CustomError(400, "something went wrong!");
  }
});

export const findAll = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const pageSize = 10;

  const myJobs = await Job.find({ user: userId });

  const jobIds = myJobs.map((job) => job._id);

  const appliesCount = await Apply.countDocuments({ job: { $in: jobIds } });

  const applies = await Apply.find({ job: { $in: jobIds } })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate("user")
    .populate("job");

  return res.json({
    applies,
    page,
    appliesCount,
    pages: Math.ceil(appliesCount / pageSize),
  });
});

export const sendMailToCandidate = asyncHandler(async (req, res) => {
  const {
    email,
    subject,
    text,
    username,
    jobTitle,
    companyName,
    date,
    isAccpeted,
  } = req.body;

  sendMail({
    email,
    subject,
    text,
    username,
    jobTitle,
    companyName,
    date,
    isAccpeted,
  });

  res.status(200).json({ message: "email has been send" });
});
