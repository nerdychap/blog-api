import { Router } from "express";
import postRouter from "@routes/postRouter";
import userRouter from "@routes/usersRouter";
import authRouter from "@routes/authRouter";

const router = Router();

router.use("/posts", postRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
