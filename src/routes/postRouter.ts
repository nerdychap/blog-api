import { validateComment, validatePost } from "@utils/validation/validation";
import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "@controllers/commentsController";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "@controllers/postsController";
import authenticationMiddleware from "@middleware/authentication";
import {
  checkCommentOwnership,
  validateCommentPostAssociation,
} from "@middleware/authorization/comments";
import { checkPostOwnership } from "@middleware/authorization/posts";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/", authenticationMiddleware, validatePost, createPost);
postRouter.get("/:id", getPostById);
postRouter.patch("/:id", authenticationMiddleware, validatePost, checkPostOwnership, updatePost);
postRouter.delete("/:id", authenticationMiddleware, checkPostOwnership, deletePost);

postRouter.post("/:postId/comments", authenticationMiddleware, validateComment, createComment);
postRouter.get("/:postId/comments", getCommentsByPost);
postRouter.delete(
  "/:postId/comments/:commentId",
  authenticationMiddleware,
  checkCommentOwnership,
  validateCommentPostAssociation,
  deleteComment
);
postRouter.patch(
  "/:postId/comments/:commentId",
  authenticationMiddleware,
  validateComment,
  checkCommentOwnership,
  validateCommentPostAssociation,
  updateComment
);

export default postRouter;
