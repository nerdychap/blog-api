import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

export const checkCommentOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const userId = req.user?.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this comment" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateCommentPostAssociation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId, postId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.postId !== Number(postId)) {
      return res.status(400).json({ message: "Comment does not belong to the specified post" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
