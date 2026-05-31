import * as admin from 'firebase-admin';
import { Session, SessionTurn } from '../types';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const getSessionHistory = async (sessionId: string): Promise<SessionTurn[]> => {
  try {
    const doc = await db.collection('sessions').doc(sessionId).get();
    if (!doc.exists) {
      return [];
    }
    const session = doc.data() as Session;
    return session.turns.slice(-3);
  } catch (error) {
    console.error('Error fetching session history:', error);
    return [];
  }
};

export const getSessionsByBusiness = async (businessId: string): Promise<Session[]> => {
  try {
    const snapshot = await db.collection('sessions')
      .where('businessId', '==', businessId)
      .orderBy('updatedAt', 'desc')
      .limit(50)
      .get();
    
    return snapshot.docs.map(doc => doc.data() as Session);
  } catch (error) {
    console.error('Error fetching sessions for business:', error);
    return [];
  }
};

export const appendSessionTurn = async (sessionId: string, businessId: string | undefined, turn: SessionTurn): Promise<void> => {
  try {
    const docRef = db.collection('sessions').doc(sessionId);
    const doc = await docRef.get();

    if (!doc.exists) {
      const newSession: Session = {
        sessionId,
        businessId: businessId || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        turns: [turn],
      };
      await docRef.set(newSession);
    } else {
      await docRef.update({
        updatedAt: new Date().toISOString(),
        turns: admin.firestore.FieldValue.arrayUnion(turn),
      });
    }
  } catch (error) {
    console.error('Error appending session turn:', error);
  }
};
