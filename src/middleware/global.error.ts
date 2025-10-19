import { Request, Response, NextFunction } from "express";

const globalErrorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const error = { ...err };
  error.message = err.message;
  console.error(error);

  res
    .status(err.status || 500)
    .json({ success: false, error: error.message || "Internal Server Error" });
};

export default globalErrorMiddleware;
