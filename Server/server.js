import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import musicRoute from "./routes/music.route.js";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 3000;
connectDB()

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);


app.use("/api/auth", userRouter)
app.use("/api/music" , musicRoute)
app.use("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.listen(PORT, () => {
  console.log("Server is started");
});
