import {
  COOKIE_MAX_AGE_IN_DAYS,
  IS_PRODUCTION,
  JWT_SECRET,
  JWT_SECRET_REFRESH,
} from "@config/env.config";
import prisma from "@prisma/prismaClient";
import { comparePassword, hashPassword } from "@utils/passwordUtils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dayjs from "dayjs";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered to another account" });
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
        id: true,
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
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const tokenId = crypto.randomBytes(32).toString("hex");
    console.log("Generated tokenId for refresh token:", tokenId);
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId: user.id, tokenId }, JWT_SECRET_REFRESH!, {
      expiresIn: "30d",
    });
    console.log("Generated refresh token for user ID:", user.id);
    const refreshTokenData = await prisma.refreshToken.create({
      data: {
        token: tokenId,
        userId: user.id,
        expiresAt: dayjs().add(30, "day").toDate(),
      },
    });

    if (!refreshTokenData) {
      return res.status(500).json({ success: false, message: "Could not create refresh token" });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: COOKIE_MAX_AGE_IN_DAYS * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });

    res.json({
      success: true,
      data: {
        token: accessToken,
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
    const refreshToken = _req.signedCookies?.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH!) as {
        userId: number;
        tokenId: string;
      };

      await prisma.refreshToken.update({
        where: {
          token: decoded.tokenId,
        },
        data: { isRevoked: true },
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });
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
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: user.id },
        data: { isRevoked: true },
      }),
    ]);

    res.json({ success: true, message: "Password updated. Please sign in again on all devices." });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieRefreshToken = req.signedCookies?.refreshToken;

    if (!cookieRefreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const decoded = jwt.verify(cookieRefreshToken, JWT_SECRET_REFRESH!) as {
      userId: number;
      tokenId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: decoded.tokenId,
        userId: decoded.userId,
        isRevoked: false,
        expiresAt: { gt: dayjs().toDate() },
      },
    });

    if (!storedToken) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
    const newTokenId = crypto.randomBytes(32).toString("hex");

    const newAuthToken = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { userId: user.id, tokenId: newTokenId },
      JWT_SECRET_REFRESH!,
      {
        expiresIn: "30d",
      }
    );

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          token: newTokenId,
          userId: user.id,
          expiresAt: dayjs().add(30, "day").toDate(), // 30 days
        },
      }),
    ]);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });

    res.cookie("authToken", newAuthToken, {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
      secure: IS_PRODUCTION,
    });

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newAuthToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
