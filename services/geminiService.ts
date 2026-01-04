
import { GoogleGenAI, Type } from "@google/genai";
import { Session } from "../types";

export const getStanceAdvice = async (history: Session[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const historySummary = history.slice(0, 5).map(s => 
    `Date: ${s.date.split('T')[0]}, Duration: ${Math.round(s.duration / 60)} mins`
  ).join('\n');

  const prompt = `
    You are a wise Kung Fu master and meditation coach specializing in Zhan Zhuang (Standing Meditation).
    Based on the following recent practice history of a student, provide a short, encouraging, and insightful 
    piece of advice or a specific tip to improve their practice. Keep it poetic but practical.
    
    Student History:
    ${historySummary}
    
    Response should be in Chinese (Simplified).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });

    return response.text || "保持专注，气沉丹田。继续努力。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "站桩贵在坚持，不求速成。";
  }
};

export const analyzePosture = async (imageData: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageData.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "这是一个正在练习站桩（Zhan Zhuang）的学生。请分析他们的姿势，并指出1-2个可以改进的地方，或者表扬做得好的地方。用简洁的中文回答。" }
        ]
      }
    });
    return response.text || "无法分析，请确保光线充足且全身入镜。";
  } catch (error) {
    console.error("Vision Error:", error);
    return "由于网络原因，暂时无法为您分析姿势。请保持平衡，重心居中。";
  }
};
