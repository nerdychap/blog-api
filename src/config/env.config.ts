import "dotenv/config";

const envConfig = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV || "development",
  COOKIE_SIGNING_SECRET: process.env.COOKIE_SIGNING_SECRET,
  COOKIE_MAX_AGE_IN_DAYS: Number(process.env.COOKIE_MAX_AGE_IN_DAYS),
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS?.split(",") || [],
};

if (!process.env.JWT_SECRET) {
  throw new Error("Missing critical environment variable: JWT_SECRET");
}
if (!process.env.JWT_EXPIRES_IN) {
  throw new Error("Missing critical environment variable: JWT_EXPIRES_IN");
}
if (!process.env.COOKIE_SIGNING_SECRET) {
  throw new Error("Missing critical environment variable: COOKIE_SIGNING_SECRET");
}
if (!process.env.COOKIE_MAX_AGE_IN_DAYS) {
  throw new Error("Missing critical environment variable: COOKIE_MAX_AGE_IN_DAYS");
}

export const {
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  NODE_ENV,
  COOKIE_SIGNING_SECRET,
  COOKIE_MAX_AGE_IN_DAYS,
  IS_PRODUCTION,
  CORS_ALLOWED_ORIGINS,
} = envConfig;
