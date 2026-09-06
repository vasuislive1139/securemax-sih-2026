import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as authLogin } from '../../src/app/api/auth/login/route';
import { GET as authChallenge } from '../../src/app/api/auth/challenge/route';
import { cookies } from 'next/headers';
import { verifyMessage } from 'viem';
import { jwtVerify } from 'jose';

// Mock Next.js next/headers cookies
vi.mock('next/headers', () => {
  const store = new Map();
  return {
    cookies: vi.fn(() => ({
      get: vi.fn((key) => store.get(key)),
      set: vi.fn((key, val) => store.set(key, { value: val })),
      delete: vi.fn((key) => store.delete(key)),
      _store: store // for test inspection
    }))
  };
});

// Mock viem verifyMessage
vi.mock('viem', () => ({
  verifyMessage: vi.fn()
}));

// Mock Supabase
vi.mock('../../src/lib/db/client', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: { user_id: 'mock-user-id', status: 'ACTIVE', users: { status: 'ACTIVE' }, roles: { name: 'ADMIN' } }, 
        error: null 
      }),
      insert: vi.fn().mockResolvedValue({ error: null })
    }))
  }
}));

describe('Authentication Flow Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const cookieStore = cookies() as any;
    cookieStore._store.clear();
  });

  it('SHOULD AUTHENTICATE: Valid signature for valid challenge issues session', async () => {
    // 1. Get Challenge
    const req1 = new Request('http://localhost/api/auth/challenge?address=0x1111111111111111111111111111111111111111');
    const res1 = await authChallenge(req1);
    const { message } = await res1.json();
    
    expect(res1.status).toBe(200);
    const cookieStore = cookies() as any;
    const challengeCookie = cookieStore._store.get('securemesh_challenge');
    expect(challengeCookie).toBeDefined();

    // 2. Mock Viem passing signature verification
    (verifyMessage as any).mockResolvedValueOnce(true);

    // 3. Post Login
    const req2 = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        address: '0x1111111111111111111111111111111111111111',
        signature: '0xvalid-signature',
        message
      })
    });
    
    const res2 = await authLogin(req2);
    const body = await res2.json();
    
    expect(res2.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.user.role).toBe('ADMIN');
    
    // Challenge should be consumed
    expect(cookieStore._store.get('securemesh_challenge')).toBeUndefined();
    // Session should be issued
    expect(cookieStore._store.get('securemesh_session')).toBeDefined();
  });

  it('SHOULD REJECT: Invalid cryptographic signature', async () => {
    // Mock Viem failing signature verification
    (verifyMessage as any).mockResolvedValueOnce(false);

    // Provide a mocked valid challenge cookie manually for testing isolated POST
    const { SignJWT } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-min-32-chars-long-padding');
    const challengeToken = await new SignJWT({ address: '0x2222222222222222222222222222222222222222', nonce: 'mocknonce' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(secret);
      
    const cookieStore = cookies() as any;
    cookieStore._store.set('securemesh_challenge', { value: challengeToken });

    const expectedMessage = `Welcome to SecureMax.\n\nPlease sign this message to verify your identity.\n\nAddress: 0x2222222222222222222222222222222222222222\nNonce: mocknonce`;

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        address: '0x2222222222222222222222222222222222222222',
        signature: '0xinvalid-signature',
        message: expectedMessage
      })
    });
    
    const res = await authLogin(req);
    expect(res.status).toBe(401); // Unauthorized
    const body = await res.json();
    expect(body.error).toBe('Invalid signature');
  });

  it('SHOULD REJECT: Missing or expired challenge (Replay Protection)', async () => {
    // No challenge cookie is set!
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        address: '0x2222222222222222222222222222222222222222',
        signature: '0xsignature',
        message: 'Welcome to SecureMax.'
      })
    });
    
    const res = await authLogin(req);
    expect(res.status).toBe(400); 
    const body = await res.json();
    expect(body.error).toBe('Challenge expired or missing');
  });

  it('SHOULD REJECT: Wallet address mismatch (Attempting to login as someone else)', async () => {
    // Challenge generated for address A
    const { SignJWT } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-min-32-chars-long-padding');
    const challengeToken = await new SignJWT({ address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', nonce: 'mocknonce' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(secret);
      
    const cookieStore = cookies() as any;
    cookieStore._store.set('securemesh_challenge', { value: challengeToken });

    // Attacker submits payload for address B, trying to hijack the challenge
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        signature: '0xsignature',
        message: `Welcome to SecureMax.\n\nPlease sign this message to verify your identity.\n\nAddress: 0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\nNonce: mocknonce`
      })
    });
    
    const res = await authLogin(req);
    expect(res.status).toBe(400); 
    const body = await res.json();
    expect(body.error).toBe('Address mismatch');
  });
});
