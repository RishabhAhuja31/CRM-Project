
import { clerkClient, verifyToken } from '@clerk/backend';

export async function authenticateRequest(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });

    
    const user = await clerkClient.users.getUser(payload.sub);
    req.user = user;

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
