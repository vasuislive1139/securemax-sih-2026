import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-min-32-chars-long-padding');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address')?.toLowerCase();

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: 'Valid wallet address required' }, { status: 400 });
    }

    // Generate random cryptographic nonce
    const nonce = crypto.randomBytes(32).toString('hex');
    const message = `Welcome to SecureMax.\n\nPlease sign this message to verify your identity.\n\nAddress: ${address}\nNonce: ${nonce}`;

    // Cryptographically bind nonce and address in an HttpOnly cookie for replay protection
    const challengeToken = await new SignJWT({ address, nonce })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m') // Expires quickly
      .sign(JWT_SECRET);

    cookies().set('securemesh_challenge', challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 300 // 5 minutes
    });

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
