import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import router from "./router/app";
import userProfileRoutes from "./router/userProfileRoutes";
import chatRoutes from "./router/chatRoutes"; 
import { handleSocketEvents } from "./socket/chatSocket";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

handleSocketEvents(io);

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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinCommunity", (communityId) => {
    socket.join(communityId);
    console.log(`User ${socket.id} joined community ${communityId}`);
  });

  socket.on("sendMessage", ({ communityId, message, senderId }) => {
    const chatMessage = { senderId, message, timestamp: new Date() };
    io.to(communityId).emit("receiveMessage", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Chat API for fetching old messages
app.use("/api/chat", chatRoutes);
