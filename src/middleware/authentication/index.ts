import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env.config";
import prisma from "../../prisma/prismaClient";
import { User } from "../../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET!);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = userExists;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized ", error: (error as Error).message });
  }
};

export default authenticationMiddleware;
