import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid, isAdmin } = req.body;

    // Validate request
    if (!uid || typeof isAdmin !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Set custom claims
    await getAuth().setCustomUserClaims(uid, { admin: isAdmin });

    // Force token refresh
    await getAuth().revokeRefreshTokens(uid);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error setting admin status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 