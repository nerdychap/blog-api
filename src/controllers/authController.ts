import { COOKIE_MAX_AGE_IN_DAYS, IS_PRODUCTION, JWT_SECRET } from "@config/env.config";
import prisma from "@prisma/prismaClient";
import { comparePassword, hashPassword } from "@utils/passwordUtils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered to another account" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { user },
      message: "User signed up successfully. Please sign in to continue.",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "6d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      signed: true,
      maxAge: COOKIE_MAX_AGE_IN_DAYS,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });

    res.json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.json({ sucess: true });
  } catch (error) {
    next(error);
  }
};
