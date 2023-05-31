import { validationResult } from "express-validator";

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => {
      return `${error.msg} for ${error.param}`;
    });

    return res.status(400).json({ message: errorMessages.join(", ") });
  } else {
    return next();
  }
};

export default validation;
