import { NextFunction, Request, Response } from "express";

export const checkUserOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.id);
  const authUserId = req.user?.id;

  if (authUserId !== userId) {
    return res.status(403).json({ message: "Forbidden: You can only access your own profile" });
  }

  next();
};
