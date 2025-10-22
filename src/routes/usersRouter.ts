import { Router } from "express";
import { deleteUser, getUser, updateUser } from "../controllers/usersController";
import authMiddleware from "../middleware/authentication";
import { checkUserOwnership } from "../middleware/authorization/users";
import { validateUserUpdate } from "../utils/validation/validation";

const userRouter = Router();

userRouter.get("/:id", authMiddleware, getUser);
userRouter.patch("/:id", authMiddleware, validateUserUpdate, checkUserOwnership, updateUser);
userRouter.delete("/:id", authMiddleware, checkUserOwnership, deleteUser);

export default userRouter;
