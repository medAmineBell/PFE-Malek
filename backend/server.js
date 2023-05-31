// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dbConfig from "./lib/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { routes } from "./routes/index.js";
import cookieParser from "cookie-parser";
import path from "path";

// Configure database connection
dbConfig();

// Create an Express application
const app = express();

// Parse incoming cookies
app.use(express.json());
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: [process.env.FRONT_URL],
    credentials: true,
  })
);

// Configure helmet middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Use Morgan for HTTP request logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const cacheOptions = {
  etag: true,
  lastModified: true,
  maxAge: '1d',
};


// Serve static files
const __dirname = path.resolve();

app.use(
  '/uploads',
  express.static(path.join(__dirname, '/uploads'), cacheOptions)
);


// Routes
app.use("/api", routes);

// app.use("/uploads", express.static(path.join(process.cwd(), "/uploads")));
// app.use("/resumes", express.static(path.join(process.cwd(), "/uploads")));

// Error handling middleware
app.use(errorHandler);

// Set the port for the Express app to listen on
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `🟢 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
