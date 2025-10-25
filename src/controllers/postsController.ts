import { NextFunction, Request, Response } from "express";
import prisma from "@prisma/prismaClient";

export const getPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.post.findMany();
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { comments: true },
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  const id = req.user?.id;

  if (!id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id } },
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
      },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const postExists = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!postExists) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const userId = req.user?.id;
    if (postExists.authorId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You can only delete your own posts" });
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true, data: postExists });
  } catch (error) {
    next(error);
  }
};
