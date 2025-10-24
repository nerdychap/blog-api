import { CORS_ALLOWED_ORIGINS } from "@/config/env.config";

export const corsConfig = {
  origin: CORS_ALLOWED_ORIGINS,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
