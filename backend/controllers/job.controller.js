import asyncHandler from "express-async-handler";
import CustomError from "../lib/custom-error.js";
import Job from "../models/job.model.js";
import NodeCache from "node-cache";
import Apply from "../models/apply.job.js";
import { unlink } from "fs";

const cache = new NodeCache();

export const getAllJobs = asyncHandler(async (req, res) => {
  const cacheKey = "featured-jobs";

  // Check if data is cached
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("Returning cached data");
    return res.status(200).json(cachedData);
  }

  const jobs = await Job.find({ isActive: true });

  if (!jobs) throw new CustomError(404, "jobs not found");

  // Cache the data for future requests
  cache.set(cacheKey, jobs, 60); // Cache for 1 minute
  console.log("Fetching new data from database");
  res.status(200).json(jobs);
});

export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    email,
    companyName,
    website,
    category,
    salary,
    location,
    jobNature,
    applicationDate,
    description,
    requiredKnowledge,
    experience,
  } = req.body;

  const job = new Job({
    title,
    image: req.file?.path,
    email,
    companyName,
    website,
    category,
    salary,
    location,
    jobNature,
    applicationDate,
    description,
    requiredKnowledge: JSON.parse(requiredKnowledge),
    experience: JSON.parse(experience),
    user: req.user._id,
  });

  if (!job) throw CustomError(400, "something went wrong");

  await job.save();

  res.status(201).json(job);
});

export const updateJob = asyncHandler(async (req, res) => {
  const {
    title,
    email,
    companyName,
    website,
    category,
    salary,
    location,
    jobNature,
    applicationDate,
    description,
    requiredKnowledge,
    experience,
  } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) throw new CustomError(404, "job not found");

  (job.title = title),
    (job.email = email),
    (job.companyName = companyName),
    (job.website = website),
    (job.category = category),
    (job.salary = salary),
    (job.location = location),
    (job.applicationDate = applicationDate),
    (job.jobNature = jobNature),
    (job.jobNature = jobNature),
    (job.description = description),
    (job.experience = experience),
    (job.requiredKnowledge = requiredKnowledge);

  const updatedJob = await job.save();
  res.status(200).json(updatedJob);
});

export const adminFilterJobs = asyncHandler(async (req, res) => {
  const { page = 1, search = "" } = req.query;

  try {
    const where = { title: { $regex: search, $options: "i" } };

    const filters = [];

    if (filters.length > 0) {
      where.$or = filters;
    }

    const [jobs, jobCount] = await Promise.all([
      Job.find(where)
        .skip((page - 1) * 9)
        .limit(9),
      Job.countDocuments(where),
    ]);

    const result = {
      jobs,
      jobCount,
      page: parseInt(page),
      pages: Math.ceil(jobCount / 9),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    CustomError(500, "Internal Server Error");
  }
});
//vooir bin 
export const filterJobs = asyncHandler(async (req, res) => {
  const { category, location, jobNature, page = 1, search = "" } = req.query;
//test123 recruteur jdid
  // Creating a cache key based on the search query and filters
  const cacheKey = `jobs_${category}_${location}_${jobNature}_${search}_${page}`;

  // Check if products are in cache
  const cachedProducts = cache.get(cacheKey);
  if (cachedProducts) {
    // Return products from cache
    console.log("Jobs_ Cache Found");
    return res.json(cachedProducts);
  }

  try {
    // Construct the `where` clause for the Mongoose query based on the provided parameters
    const where = { title: { $regex: search, $options: "i" } };

    const filters = [];
    if (category) filters.push({ category });
    if (location) filters.push({ location });
    if (jobNature) filters.push({ jobNature });

    if (filters.length > 0) {
      where.$or = filters;
    }

    // Use `Promise.all` to run multiple Mongoose queries in parallel
    const [jobs, jobCount] = await Promise.all([
      Job.find(where)
        .skip((page - 1) * 9)
        .limit(9),
      Job.countDocuments(where),
    ]);

    const [locations, categories, jobNatures] = await Promise.all([
      Job.find({}).distinct("location"),
      Job.find({}).distinct("category"),
      Job.find({}).distinct("jobNature"),
    ]);

    const result = {
      jobs,
      categories,
      locations,
      jobCount,
      jobNatures,
      page: parseInt(page),
      pages: Math.ceil(jobCount / 9),
    };

    res.status(200).json(result);

    // Store jobs in cache for 5 minutes
    cache.set(
      cacheKey,
      result,
      60 * 5 //5min
    );
  } catch (error) {
    console.error(error);
    CustomError(500, "Internal Server Error");
  }
});

export const findAllRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ user: req.user._id }).populate("applies");

  if (!jobs) throw new CustomError(404, "jobs not found");

  res.status(200).json(jobs);
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) throw new CustomError(404, "job not found");

  res.status(200).json(job);
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) throw new CustomError(404, "job not found!");

  const prevImageUrl = job.image.substring(15);

  console.log({ image: prevImageUrl });

  unlink(`${process.cwd()}/uploads/images/${prevImageUrl}`, (err) => {
    if (err) console.log(err);
  });

  await Apply.deleteMany({ job: req.params.id });

  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "job has been deleted" });
});

export const adminUpdateJob = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) throw new CustomError(404, "job not found!");
  job.isActive = isActive;

  const updateJob = await job.save();

  console.log({ updateJob });
  res.status(200).json(updateJob);
});
