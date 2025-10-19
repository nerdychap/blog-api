import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import globalErrorMiddleware from "./middleware/global.error";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/v1", router);
app.use(globalErrorMiddleware);

export default app;
