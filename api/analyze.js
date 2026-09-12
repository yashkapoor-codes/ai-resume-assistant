import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { resume } = req.body;

    if (!resume || typeof resume !== "string" || resume.trim().length < 50) {
      return res.status(400).json({
        error: "Please provide a resume with at least 50 characters.",
      });
    }

    const prompt = `
Analyze this resume professionally.

Return JSON with exactly these fields:

{
  "summary": "short overall assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Resume:
${resume}
`;

    const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",  
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const analysis = JSON.parse(response.text);

    return res.status(200).json({
      analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return res.status(500).json({
error: "Unable to analyze the resume right now. Please try again later.",
});

  }
}