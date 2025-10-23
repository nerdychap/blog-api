import { NextFunction, Request, Response } from "express";
import prisma from "@prisma/prismaClient";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      omit: { password: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const userExists = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  const userId = req.user?.id;

  if (userId !== Number(id)) {
    return res.status(403).json({ message: "You can only update your own profile" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
      },
      omit: { password: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const userExists = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const user = await prisma.user.delete({
      where: { id: Number(id) },
      omit: { password: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
