import { Router, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { verifyAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const db = admin.firestore();

// POST /business - Create or update business context
router.post('/', verifyAuth, async (req: AuthRequest, res: Response) => {
  const { businessId, name, context } = req.body;
  const ownerUid = req.user?.uid;
  
  if (!name || !context) {
    res.status(400).json({ error: 'Name and context are required' });
    return;
  }

  try {
    let docRef;
    let finalId = businessId;

    if (businessId) {
      docRef = db.collection('businesses').doc(businessId);
    } else {
      docRef = db.collection('businesses').doc();
      finalId = docRef.id;
    }

    await docRef.set({
      name,
      context,
      ownerUid,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.json({ success: true, businessId: finalId });
  } catch (error) {
    console.error('Error saving business:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /business/:id - Fetch business context
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const doc = await db.collection('businesses').doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }
    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /business/:id/sessions - Fetch conversation history for a business
router.get('/:id/sessions', verifyAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const ownerUid = req.user?.uid;
  
  try {
    const doc = await db.collection('businesses').doc(id).get();
    if (!doc.exists || doc.data()?.ownerUid !== ownerUid) {
      res.status(403).json({ error: 'Unauthorized to view these sessions' });
      return;
    }

    const { getSessionsByBusiness } = await import('../services/firestore');
    const sessions = await getSessionsByBusiness(id);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
