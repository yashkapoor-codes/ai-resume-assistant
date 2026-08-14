import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system:
        "You are an expert resume reviewer. Analyze resumes professionally and give practical, specific advice. Return valid JSON only.",
      messages: [
        {
          role: "user",
          content: `Analyze this resume and return JSON with exactly these fields:
{
  "summary": "short overall assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Resume:
${resume}`,
        },
      ],
    });

    const text = message.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "AI returned an invalid response. Please try again.",
      });
    }

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
