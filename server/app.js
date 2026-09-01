import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "ioredis";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean),
  credentials: true,
};

// Security headers
app.use(helmet());

// CORS must be applied before rate limiters so that preflight (OPTIONS) responses
// and rate-limit (429) responses both carry the required Access-Control-* headers.
app.use(cors(corsOptions));

// Structured HTTP request logging (skip in test environment)
if (process.env.NODE_ENV !== "test") {
  app.use(pinoHttp({ logger }));
}

// Redis client for distributed rate limiting (falls back to memory store if REDIS_URL is unset)
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = new createClient(process.env.REDIS_URL);
  redisClient.on("error", (err) => logger.error({ err }, "Redis client error"));
}

const makeRateLimitStore = () =>
  redisClient
    ? new RedisStore({ sendCommand: (...args) => redisClient.call(...args) })
    : undefined; // undefined → in-memory default

// General API rate limiter — 100 req / 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeRateLimitStore(),
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", apiLimiter);

// Stricter auth limiter — 20 req / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeRateLimitStore(),
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});
app.use("/api/auth", authLimiter);

// Middleware
app.use(cookieParser()); // Must come before routes to parse JWT cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

export default app;
