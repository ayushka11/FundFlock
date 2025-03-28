import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import "./helpers/cronJobs";
import communityRoutes from "./router/community";
import "./models/users";
import "./models/communities";
import "./models/userProfile";
import "./models/milestones";
import router from "./router/app";
import userProfileRoutes from "./router/userProfileRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const MONGO_URL = process.env.MONGO_URL || "";

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in .env");
}

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error) => {
  console.error(error);
});

// Use the main router
app.use("/", router());

// Use user profile routes
app.use("/api/users", userProfileRoutes);

// Use community routes
app.use("/community", communityRoutes);