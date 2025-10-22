import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), success: false, message: "Validation failed" });
  }
  next();
};

export const validateComment = [
  body("content").notEmpty().withMessage("Comment is required"),
  handleValidationErrors,
];

export const validatePost = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Post content is required"),
  handleValidationErrors,
];

export const validateUserUpdate = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  handleValidationErrors,
];

export const validatePasswordReset = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

export const validateUserRegistration = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  handleValidationErrors,
];

export const validateUserLogin = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];
