import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getVerifiedSession } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/db/client';

export async function POST() {
  try {
    const session = await getVerifiedSession().catch(() => null);
    
    if (session) {
      // Revoke in database
      await supabaseAdmin
        .from('access_sessions')
        .update({ status: 'REVOKED' })
        .eq('id', session.sessionId);
    }

    cookies().delete('securemesh_session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
