'use server';

import { supabaseAdmin } from '@/lib/db/client';
import { getVerifiedSession } from '@/lib/auth/session';
import { UserRole } from '@/types';

export async function getDashboardMetrics() {
  try {
    const session = await getVerifiedSession();
    if (session.role !== UserRole.ADMIN) {
      throw new Error('Forbidden');
    }

    const { count: usersCount, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: assetsCount, error: assetsError } = await supabaseAdmin
      .from('assets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ACTIVE');

    const { count: pendingRequests, error: reqError } = await supabaseAdmin
      .from('access_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');

    const { count: alertsCount, error: alertsError } = await supabaseAdmin
      .from('security_findings')
      .select('*', { count: 'exact', head: true })
      .in('severity', ['HIGH', 'CRITICAL'])
      .eq('status', 'OPEN');

    const { data: auditLogs, error: auditError } = await supabaseAdmin
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (usersError || assetsError || reqError || alertsError || auditError) {
      throw new Error('Database connection failed');
    }

    return {
      success: true,
      data: {
        totalUsers: usersCount || 0,
        activeAssets: assetsCount || 0,
        pendingAccessRequests: pendingRequests || 0,
        criticalAlerts: alertsCount || 0,
        recentAudits: auditLogs || [],
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Database not configured or unreachable.'
    };
  }
}
