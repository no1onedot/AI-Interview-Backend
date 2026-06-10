console.log("VERSION 2");
import express from 'express';
import cors from 'cors';
import { connectDB } from "./Config/db.js";
import dotenv from 'dotenv';
import userRoutes from './Routes/UserRoute.js';
import aiRoutes from "./Routes/AiRoute.js";
import session from "express-session";

dotenv.config();


const app = express();
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  console.log("Path:", req.path);
  next();
});
app.use(
  cors({
    origin: [
          "http://localhost:5173",
      "hhttps://ai-interview-git-main-no1onedots-projects.vercel.app",
      "https://ai-interview-qs4lj2qy7-no1onedots-projects.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:  7 *  24 * 60 * 60 * 1000 } // Set to true if using HTTPS
}));

// routes
app.use('/api/users', userRoutes);
app.use("/api/ai", aiRoutes);

// Config connections
connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});