import { Router } from "express";
import { refreshToken, resetPassword, signIn, signOut, signUp } from "@controllers/authController";
import {
  validatePasswordReset,
  validateUserLogin,
  validateUserRegistration,
} from "@utils/validation/validation";
import authenticationMiddleware from "@/middleware/authentication";

const authRouter = Router();

authRouter.post("/sign-up", validateUserRegistration, signUp);
authRouter.post("/sign-in", validateUserLogin, signIn);
authRouter.post("/sign-out", authenticationMiddleware, signOut);
authRouter.patch("/reset-password", validatePasswordReset, resetPassword);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
