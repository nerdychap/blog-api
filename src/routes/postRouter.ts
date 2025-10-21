import { Router } from "express";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../controllers/postsController";
import authenticationMiddleware from "../middleware/authentication";
import { checkPostOwnership } from "../middleware/authorization/posts";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/", authenticationMiddleware, createPost);
postRouter.get("/:id", getPostById);
postRouter.patch("/:id", authenticationMiddleware, checkPostOwnership, updatePost);
postRouter.delete("/:id", authenticationMiddleware, checkPostOwnership, deletePost);

export default postRouter;
