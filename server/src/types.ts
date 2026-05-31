export interface AnalyzeRequest {
  sessionId: string;
  businessId?: string;
  transcript: string;
  frustrationScore: number;
  businessContext?: string;
}

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

export interface SessionTurn {
  transcript: string;
  intent: string;
  frustrationScore: number;
  voiceReply: string;
  timestamp: string;
}

export interface Session {
  sessionId: string;
  businessId?: string;
  createdAt: string;
  updatedAt: string;
  turns: SessionTurn[];
}
