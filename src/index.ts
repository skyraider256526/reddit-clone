import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import { miscRoutes, postRoutes, subRoutes, userRoutes } from "./routes";
import { trim } from "./middlewares";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  express.json(),
  morgan("dev"),
  cookieParser(),
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(trim);

app.get("/", (_, res) => res.send("Hello"));

// API
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/sub", subRoutes);
app.use("/api/misc", miscRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`Server running at : ${process.env.PORT}`);
  try {
    await createConnection();
    console.log("Database connected");
  } catch (error) {
    console.error(error);
  }
});
