import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0"; // Allows external requests

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file. Please add it.");
  process.exit(1);
}

// Test route
app.get("/", (req, res) => {
  res.status(200).send("✅ Server is running!");
});


app.use("/api/users", userRoutes);

// Connect to MongoDB and Start Server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as mongoose.ConnectOptions)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
