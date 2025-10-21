import { Router } from "express";
import { resetPassword, signIn, signUp } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.patch("/reset-password", resetPassword);

export default authRouter;
