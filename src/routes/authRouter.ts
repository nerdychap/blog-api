import { Router } from "express";
import { resetPassword, signIn, signUp } from "../controllers/authController";
import {
  validatePasswordReset,
  validateUserLogin,
  validateUserRegistration,
} from "../utils/validation/validation";

const authRouter = Router();

authRouter.post("/sign-up", validateUserRegistration, signUp);
authRouter.post("/sign-in", validateUserLogin, signIn);
authRouter.patch("/reset-password", validatePasswordReset, resetPassword);

export default authRouter;
