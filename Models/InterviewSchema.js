import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  resumeText: String,

  summary: String,

  strengths: [String],

  weaknesses: [String],

  questions: [String]
}, {
  timestamps: true
});

export default mongoose.model(
  "Interview",
  interviewSchema
);