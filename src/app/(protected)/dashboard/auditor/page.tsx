import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Search, Filter, ShieldCheck, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabaseAdmin } from '@/lib/db/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getVerifiedSession } from '@/lib/auth/session';

export default async function AuditorDashboardPage() {
  await getVerifiedSession(); // Validate session exists

  const { data: logs } = await supabaseAdmin
    .from('audit_events')
    .select('*, users(display_name)')
    .order('created_at', { ascending: false })
    .limit(15);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Audit Log</h2>
          <p className="text-muted-foreground mt-1">Immutable, tamper-evident cryptographic event ledger.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Badge variant="outline" className="border-purple-500/50 text-purple-400 px-4 py-1.5 font-mono">
            ROLE: AUDITOR
          </Badge>
        </div>
      </div>

      <Card className="glass-panel border-white/5">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>System Events</CardTitle>
              <CardDescription>Domain 1 synchronized chronological log</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Search hash, ID, or event..." className="pl-9 bg-black/40 border-white/10" />
              </div>
              <Button variant="outline" size="icon" className="border-white/10 shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-black/20 font-mono">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Timestamp</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Event Type</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Actor</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Target</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5 text-right">Event Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs && logs.length > 0 ? (
                  logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[10px] tracking-wider uppercase font-mono">
                          {log.event_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-foreground/80">
                        {log.actor_id ? `${log.actor_id.substring(0,8)}...` : 'SYSTEM'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-foreground/80">
                        {log.target_id ? `${log.target_id.substring(0,8)}...` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-[10px] text-muted-foreground group-hover:text-cyan-400 transition-colors">
                        {log.event_hash}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <ShieldCheck className="h-8 w-8 mb-3 opacity-50" />
                        <p>No audit events recorded.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center text-xs text-muted-foreground">
            <span>Showing recent 15 events</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled>Previous</Button>
              <Button variant="ghost" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
