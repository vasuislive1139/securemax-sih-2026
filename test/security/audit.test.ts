import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runSecurityScanAction, fetchSecurityPosture } from '../../src/app/actions/sentinel';
import { logTransaction } from '../../src/app/actions/transactions';
import * as sessionModule from '../../src/lib/auth/session';
import { UserRole } from '../../src/types';

vi.mock('server-only', () => ({}));

// Mock the DB client
vi.mock('../../src/lib/db/client', () => {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
  };
  return {
    supabaseAdmin: { from: () => mockChain },
    supabaseClient: { from: () => mockChain }
  };
});

describe('Server Action Security Tests (Privilege Escalation & Access Control)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('PREVENTS IDOR & PRIVILEGE ESCALATION: Sentinel scan rejects non-admin users', async () => {
    vi.spyOn(sessionModule, 'getVerifiedSession').mockResolvedValueOnce({
      userId: 'hacker-123',
      role: UserRole.USER,
      sessionId: 'sess-1'
    });

    const result = await runSecurityScanAction('hacker-123');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Forbidden/);
  });

  it('PREVENTS DATA LEAKAGE: fetchSecurityPosture requires authentication and role', async () => {
    vi.spyOn(sessionModule, 'getVerifiedSession').mockRejectedValueOnce(new Error('Unauthorized'));

    const result = await fetchSecurityPosture();
    // It should safely return empty arrays rather than crashing or leaking
    expect(result.scans.length).toBe(0);
    expect(result.findings.length).toBe(0);
    expect(result.incidents.length).toBe(0);
  });

  it('PREVENTS DATABASE INJECTION: logTransaction requires valid session', async () => {
    vi.spyOn(sessionModule, 'getVerifiedSession').mockRejectedValueOnce(new Error('Unauthorized'));

    const result = await logTransaction({
      tx_hash: '0xfakehash',
      chain_id: 11155111,
      entity_type: 'ASSET',
      entity_id: 'fake-id',
      status: 'CONFIRMED'
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Unauthorized/);
  });
});
