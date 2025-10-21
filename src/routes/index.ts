import { Router } from "express";
import postRouter from "./postRouter";
import userRouter from "./usersRouter";
import authRouter from "./authRouter";
import commentRouter from "./commentRouter";

const router = Router();

router.use("/posts", postRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/comments", commentRouter);

export default router;
