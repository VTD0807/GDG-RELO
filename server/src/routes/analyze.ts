import { Router, Request, Response } from 'express';
import { AnalyzeRequest, SessionTurn } from '../types';
import { getSessionHistory, appendSessionTurn } from '../services/firestore';
import { analyzeWithGemini } from '../services/gemini';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { sessionId, businessId, transcript, frustrationScore, businessContext } = req.body as AnalyzeRequest;

  if (!sessionId || !transcript) {
    res.status(400).json({ error: 'sessionId and transcript are required' });
    return;
  }

  try {
    const history = await getSessionHistory(sessionId);
    const result = await analyzeWithGemini(
      transcript,
      frustrationScore,
      history,
      businessContext
    );

    const turn: SessionTurn = {
      transcript,
      intent: result.intent,
      frustrationScore,
      voiceReply: result.voiceReply,
      timestamp: new Date().toISOString(),
    };
    await appendSessionTurn(sessionId, businessId, turn);

    res.json(result);
  } catch (error) {
    console.error('Error in analyze route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
