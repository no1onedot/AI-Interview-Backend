import express from "express";
import upload from "../Middlewares/Mutler.js";
import  {uploadResume } from "../Controllers/AiControllers.js";
import auth from "../Middlewares/Auth.js";
import { getHistory } from "../Controllers/AiControllers.js";

const router = express.Router();

router.post(
  "/upload",auth,
  upload.single("resume"),
  uploadResume
);
router.get(
  "/history",
  auth,
  getHistory
);

export default router;

