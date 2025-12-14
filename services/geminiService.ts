import { GoogleGenAI } from "@google/genai";
import { Step, Scenario } from "../types";
import { STEPS_INFO } from "../constants";

// Declare process to satisfy TypeScript without @types/node
declare const process: any;

let ai: GoogleGenAI | null = null;

try {
  // Check if process is defined to avoid runtime errors in some environments
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const getSmartHint = async (
  currentStep: Step,
  scenario: Scenario,
  userHistory: string[]
): Promise<string> => {
  if (!ai) {
    return STEPS_INFO[currentStep].hint + " (AI 离线 - 请检查 API KEY)";
  }

  const stepName = STEPS_INFO[currentStep].title;
  const recentActions = userHistory.slice(-3).join(", ");

  const prompt = `
    你是一名专业的动作捕捉技术讲师。
    学生正在进行虚拟仿真实验。
    当前任务: ${stepName}。
    场景: ${scenario}。
    学生最近的操作记录: [${recentActions}]。
    
    学生遇到了困难并请求提示。
    请提供一个简洁、专业的中文操作提示（不超过2句话），准确指导他们下一步应该点击什么按钮或执行什么操作来完成当前步骤。
    语气要专业、鼓励。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || STEPS_INFO[currentStep].hint;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return STEPS_INFO[currentStep].hint;
  }
};