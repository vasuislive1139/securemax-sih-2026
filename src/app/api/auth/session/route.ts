import { NextResponse } from 'next/server';
import { getVerifiedSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getVerifiedSession();
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json({ session: null });
  }
}
