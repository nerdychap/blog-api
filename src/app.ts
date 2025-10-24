import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import globalErrorMiddleware from "@middleware/globalErrorMiddleware";
import router from "@routes/index";
import cookieParser from "cookie-parser";
import { COOKIE_SIGNING_SECRET } from "./config/env.config";
import cors from "cors";
import { corsConfig } from "@utils/cors";

const app = express();

app.use(cors(corsConfig));
app.use(cookieParser(COOKIE_SIGNING_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);
app.use("/api/v1", router);
app.use(globalErrorMiddleware);

export default app;
