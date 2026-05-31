export interface Action {
  id: string;
  label: string;
  description: string;
  type: 'resolve' | 'escalate' | 'inform' | 'offer';
  priority: number;
}

export interface AnalyzeResponse {
  intent: string;
  intentLabel: string;
  confidence: number;
  sentimentScore: number;
  sentimentLabel: string;
  actions: Action[];
  voiceReply: string;
  speakingRate: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function analyzeTurn(
  sessionId: string,
  businessId: string | undefined,
  transcript: string,
  frustrationScore: number,
  businessContext?: string
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      businessId,
      transcript,
      frustrationScore,
      businessContext,
    }),
  });

  if (!response.ok) {
    throw new Error(`Analyze API error: ${response.statusText}`);
  }

  return await response.json();
}
