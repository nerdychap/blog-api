import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prismaClient";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postId, content } = req.body;
  const userId = req.user?.id;

  try {
    const newComment = await prisma.comment.create({
      data: {
        post: { connect: { id: postId } },
        content,
        author: { connect: { id: userId! } },
      },
    });
    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
    });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
    });
    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    next(error);
  }
};
