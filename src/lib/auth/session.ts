import 'server-only';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { UserRole } from '@/types';

export async function getVerifiedSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('securemesh_session')?.value;
  
  if (!sessionToken) {
    throw new Error('Unauthorized');
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-min-32-chars-long-padding');
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    return payload as { userId: string, role: UserRole, sessionId: string };
  } catch (error) {
    throw new Error('Invalid session token');
  }
}
