import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

export const checkPostOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const postId = Number(req.params.id);
  const userId = req.user?.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ message: "Forbidden: You do not own this post" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
