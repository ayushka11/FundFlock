import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes'
import communityRoutes from './routes/communityRoutes'
import transactionRoutes from "./routes/transactionRoutes";
import milestoneRoutes from "./routes/milestoneRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0"; // ✅ Allows access from CLI & external requests


if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file. Please add it.");
  process.exit(1);
}

// ✅ Add a basic test route

app.get("/", (req, res) => {
  res.status(200).send("✅ Server is running!");
});


app.use('/api/users',userRoutes);
app.use('/api/communities',communityRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/profile', profileRoutes);


// ✅ Connect to MongoDB and Start Server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as mongoose.ConnectOptions)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // ✅ Use `HOST` in `app.listen()` for CLI access
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

  
