import { Router } from "express";
import postRouter from "./postRouter";
import userRouter from "./usersRouter";
import authRouter from "./authRouter";

const router = Router();

router.use("/posts", postRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
