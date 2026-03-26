import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type } from "@google/genai";

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async extractLeadsFromText(text: string, query: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Extract a list of company leads from the following scraped text.
        The user is searching for: "${query}".
        
        CLEANING & NORMALIZATION RULES:
        1. Normalize company names (e.g., "ABC Pvt. Ltd." instead of "abc pvt ltd").
        2. Ensure websites start with http:// or https://.
        3. Format phone numbers with country codes if possible.
        4. If a field is missing, use null.
        5. Only include real companies, not directories or blog sites.
        6. Provide a leadScore (0-100) based on how well they match the query.
        
        Scraped Text:
        ${text.substring(0, 10000)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              industry: { type: Type.STRING },
              description: { type: Type.STRING },
              website: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              annualValue: { type: Type.STRING },
              leadScore: { type: Type.NUMBER },
            },
            required: ["name"],
          },
        },
      },
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      this.logger.error("Failed to parse AI response:", e.stack);
      return [];
    }
  }

  async generateLeadInsights(lead: any) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Perform a deep business analysis for the following lead:
      Company: ${lead.name}
      Industry: ${lead.industry}
      Location: ${lead.location}
      Description: ${lead.description}

      Return a JSON object with:
      - summary: A concise business summary (Markdown supported)
      - industryClassification: A specific industry category
      - opportunityScore: A number from 0 to 100 representing market potential
      - buyingIntentScore: A number from 0 to 100 representing likelihood to purchase`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            industryClassification: { type: Type.STRING },
            opportunityScore: { type: Type.INTEGER },
            buyingIntentScore: { type: Type.INTEGER },
          },
          required: ["summary", "industryClassification", "opportunityScore", "buyingIntentScore"],
        },
      },
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      this.logger.error(`Failed to parse AI insights for lead ${lead.id}:`, e.stack);
      throw new Error("Failed to generate structured insights");
    }
  }
}
