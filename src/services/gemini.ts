import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getAIInsights = async (companyName: string, industry: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief trade intelligence insight for a company named "${companyName}" in the "${industry}" sector in Nepal. Focus on market potential and risks. Keep it under 100 words.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to generate AI insights at this time.";
  }
};
