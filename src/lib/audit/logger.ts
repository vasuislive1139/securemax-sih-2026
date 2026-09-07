import { supabaseAdmin } from '@/lib/db/client';
import { AuditEvent, AuditEventType } from '@/types';
import crypto from 'crypto';

export interface AuditLogParams {
  eventType: AuditEventType | string;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, any>;
}

/**
 * Foundational security logging module.
 * In later phases, this will implement the full hash-chaining logic.
 */
export async function logAuditEvent(params: AuditLogParams) {
  try {
    // 1. Fetch previous hash
    let lastEvent: { event_hash?: string } | null = null;
    try {
      const query: any = supabaseAdmin
        .from('audit_events')
        .select('event_hash')
        .order('id', { ascending: false })
        .limit(1);
      const res = typeof query.maybeSingle === 'function' 
        ? await query.maybeSingle() 
        : await query.single();
      lastEvent = res?.data || null;
    } catch {
      lastEvent = null;
    }

    const prevHash = lastEvent?.event_hash || '0x0000000000000000000000000000000000000000000000000000000000000000';

    // 2. Compute current hash
    const hashData = JSON.stringify({
      eventType: params.eventType,
      actorId: params.actorId,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details,
      prevHash,
    });
    const rawHash = crypto.createHash('sha256').update(hashData).digest('hex');
    const eventHash = rawHash.startsWith('0x') ? rawHash : `0x${rawHash}`;

    // 3. Insert into database
    const { error } = await supabaseAdmin.from('audit_events').insert({
      event_type: params.eventType,
      actor_id: params.actorId || null,
      target_type: params.targetType || null,
      target_id: params.targetId || null,
      event_hash: eventHash,
      prev_hash: prevHash,
    });

    if (error) {
      console.error('Failed to anchor audit event to database', error);
      // Fail closed policy for critical logs: throw error
      throw new Error('Audit logging failed');
    }

    return eventHash;
  } catch (err) {
    console.error('Audit Error:', err);
    throw err;
  }
}
