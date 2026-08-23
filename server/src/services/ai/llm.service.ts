import { GoogleGenerativeAI } from "@google/generative-ai";

export class LLMService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Server Configuration Error: GEMINI_API_KEY is not set.");
    }
    return new GoogleGenerativeAI(apiKey);
  }

  static async generateResponse(prompt: string, contextString?: string) {
    const genAI = this.getClient();
    const modelName = process.env.GEMINI_MODEL;
    if (!modelName) {
      throw new Error("Server Configuration Error: GEMINI_MODEL is not set.");
    }
    const model = genAI.getGenerativeModel({ model: modelName });

    let fullPrompt = prompt;
    if (contextString) {
      fullPrompt = `System Context:\n${contextString}\n\nUser Prompt:\n${prompt}`;
    }

    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Estimate tokens
      const tokenCountResult = await model.countTokens(fullPrompt);
      const outputTokenCountResult = await model.countTokens(text);

      return {
        text,
        tokens: tokenCountResult.totalTokens + outputTokenCountResult.totalTokens,
      };
    } catch (error: any) {
      console.error("LLM Provider Error:", error);
      throw new Error("Failed to communicate with the AI provider.");
    }
  }
}
