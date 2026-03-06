
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface NearestClinicResult {
  clinicName: string;
  distance: string;
  duration: string;
  address: string;
}

export const findNearestClinic = async (userAddress: string, clinicNames: string[]): Promise<NearestClinicResult | null> => {
  try {
    const prompt = `
      我現在在台南市的「${userAddress}」。
      請從以下台南市的診所名單中，找出距離我最近的一家診所：
      ${clinicNames.join(', ')}
      
      請使用 Google Maps 找出這家診所的正確地址，並計算從我的位置到該診所的「行車距離」和「行車時間」。
      
      請務必回傳 JSON 格式，包含以下欄位：
      - clinicName: 診所名稱
      - distance: 行車距離 (例如: 2.5 公里)
      - duration: 行車時間 (例如: 8 分鐘)
      - address: 診所地址
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleMaps: {} }],
        // Note: responseMimeType: "application/json" is NOT allowed with googleMaps tool
      },
    });

    const text = response.text;
    if (!text) return null;

    // Extract JSON from text if it's wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return null;
  } catch (error) {
    console.error("Error finding nearest clinic:", error);
    return null;
  }
};
