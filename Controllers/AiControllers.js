import fs from "fs";
import { createRequire } from "module";
import ai from "../Config/gemini.js";
import Interview from "../Models/InterviewSchema.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadResume = async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text;
 const prompt = `
Analyze this resume.

Return ONLY valid JSON.

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "questions": []
}

Resume:

${resumeText}
`;
const result = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});

const analysisText = result.text;

// Gemini sometimes wraps JSON in ```json
const cleaned = analysisText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const analysis = JSON.parse(cleaned);

res.json({
  success: true,
  analysis
});

const interview = await Interview.create({
  userId: req.user.id, // if auth middleware exists

  resumeText,

  summary: analysis.summary,

  strengths: analysis.strengths,

  weaknesses: analysis.weaknesses,

  questions: analysis.questions
}); 
// save interview to DB, linked to user
    await interview.save();


  } catch (error) {
   if (error.status === 503) {
      return res.status(503).json({
         success: false,
         message: "Gemini is busy. Please try again in a few seconds."
      });
   }


    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Interview.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};