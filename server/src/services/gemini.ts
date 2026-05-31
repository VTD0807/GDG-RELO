import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyzeResponse, SessionTurn } from '../types';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeWithGemini = async (
  transcript: string,
  frustrationScore: number,
  sessionHistory: SessionTurn[],
  businessContext?: string
): Promise<AnalyzeResponse> => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const historyStr = JSON.stringify(sessionHistory, null, 2);

  const prompt = `You are a customer experience AI for a business. Analyze the customer's message and respond ONLY with a valid JSON object — no markdown, no explanation, no extra text.
${businessContext ? `Business context: ${businessContext}` : ''}

Customer transcript: "${transcript}"
Frustration score (0=calm, 1=very frustrated): ${frustrationScore}
Session history (last 3 turns): ${historyStr}

Return this exact JSON structure:
{
  "intent": one of [refund_request, delivery_issue, cancellation, complaint, general_inquiry, compliment],
  "intentLabel": "human readable",
  "confidence": number 0-1,
  "sentimentScore": number 0-1 (0=very frustrated, 1=very happy),
  "sentimentLabel": one of [frustrated, concerned, neutral, satisfied, happy],
  "actions": array of 2-3 objects with {id, label, description, type, priority},
  "voiceReply": "a warm, conversational reply — if frustrationScore > 0.6, be extra empathetic and lead with acknowledgment before resolution",
  "speakingRate": number (0.75 if frustrated, 0.9 if concerned, 1.1 if neutral/happy)
}`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Strip markdown formatting if Gemini includes it
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text) as AnalyzeResponse;
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    return {
      intent: 'general_inquiry',
      intentLabel: 'General Inquiry',
      confidence: 0.5,
      sentimentScore: 0.5,
      sentimentLabel: 'neutral',
      actions: [],
      voiceReply: "I'm sorry, I'm having trouble processing that right now. Could you please repeat?",
      speakingRate: 1.0,
    };
  }
};
