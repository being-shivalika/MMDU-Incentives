import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ... rest of your server.js imports and code follow below

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Connect to database
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://mmdu-incentives.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use("/api", apiLimiter);

// Serve uploaded files
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "MMDU Research Incentive Management System API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port} bound to 0.0.0.0`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT) {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(error);
      process.exit(1);
    }
  });
};

startServer(PORT);
