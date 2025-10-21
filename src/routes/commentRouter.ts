import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
} from "../controllers/commentsController";
import authMiddleware from "../middleware/authentication";
import { checkCommentOwnership } from "../middleware/authorization/comments";

const commentRouter = Router();

commentRouter.post("/post/:postId", authMiddleware, createComment);
commentRouter.get("/post/:postId", getCommentsByPost);
commentRouter.delete("/:commentId", authMiddleware, checkCommentOwnership, deleteComment);
commentRouter.patch("/:commentId", authMiddleware, checkCommentOwnership, updateComment);

export default commentRouter;
