import { supabaseAdmin } from '@/lib/db/client';
import { AuditEvent, AuditEventType } from '@/types';
import crypto from 'crypto';

export interface AuditLogParams {
  eventType: AuditEventType;
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
    // 1. Fetch previous hash (mocked for foundation phase)
    // In production, this must use a strict serialized transaction to ensure sequence
    const { data: lastEvent } = await supabaseAdmin
      .from('audit_events')
      .select('event_hash')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    const prevHash = lastEvent?.event_hash || 'GENESIS_HASH';

    // 2. Compute current hash
    const hashData = JSON.stringify({
      eventType: params.eventType,
      actorId: params.actorId,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details,
      prevHash,
    });
    const eventHash = crypto.createHash('sha256').update(hashData).digest('hex');

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
