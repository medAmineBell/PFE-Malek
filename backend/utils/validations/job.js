import { body } from "express-validator";

export const createJobValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("companyName").notEmpty().withMessage("Company name is required"),
  body("website").optional().isURL().withMessage("Website URL is invalid"),
  body("category").optional().notEmpty().withMessage("Category is required"),
  body("salary").optional().notEmpty().withMessage("Salary is required"),
  body("location").optional().notEmpty().withMessage("Location is required"),
  body("jobNature").optional().notEmpty().withMessage("Job nature is required"),
  body("applicationDate"),
  body("description").notEmpty().withMessage("Description is required"),
  body("requiredKnowledge")
    .isJSON()
    .withMessage("Required knowledge should be an array"),
  body("experience").isJSON().withMessage("Experience should be an array"),
];
