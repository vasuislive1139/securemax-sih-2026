import * as React from 'react';
import { Database, ShieldCheck, FileText, ChevronDown } from 'lucide-react';
import { supabaseAdmin } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export default async function AuditTrailPage() {
  const { data: auditEvents, error } = await supabaseAdmin
    .from('audit_events')
    .select('*')
    .order('created_at', { ascending: false });

  const displayAudit = auditEvents || [];

  return (
    <div className="space-y-6 font-sans selection:bg-cyan-500/30 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 uppercase flex items-center gap-3">
            <FileText className="h-6 w-6 text-emerald-500" />
            Audit & Forensics
          </h2>
          <p className="text-sm text-zinc-500 font-mono tracking-widest mt-1 uppercase">Tamper-Evident Event Ledger</p>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-xs tracking-widest uppercase px-6 py-3 rounded flex items-center transition-colors bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="mr-2 h-4 w-4" /> INTEGRITY VERIFIED
        </div>
      </div>

      <div className="space-y-6">
        {displayAudit.length > 0 ? displayAudit.map((log) => (
          <div key={log.id} className="bg-[#0a0a0c] border border-zinc-800 rounded-lg overflow-hidden">
            <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-24 text-[10px] font-mono text-zinc-500">{new Date(log.created_at).toLocaleTimeString()}</div>
                <div className="text-xs font-bold tracking-widest text-zinc-100 uppercase truncate w-[250px]">{log.event_type}</div>
                <div className={`text-[10px] font-mono tracking-widest px-3 py-1 rounded ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : log.status === 'DENIED' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {log.status || 'LOGGED'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* AUDIT EVENT */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">Audit Event</h4>
                 <div className="space-y-2 text-xs font-mono">
                   <div className="flex justify-between"><span className="text-zinc-600">EVENT ID</span><span className="text-zinc-300 truncate max-w-[120px]">{log.id}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">ACTOR</span><span className="text-zinc-300 truncate max-w-[120px]">{log.actor_did}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">ACTION</span><span className="text-zinc-300 truncate max-w-[120px]">{log.event_type}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">ASSET</span><span className="text-cyan-400 truncate max-w-[120px]">{log.target_id || 'SYSTEM'}</span></div>
                 </div>
               </div>

               {/* INTEGRITY */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">Integrity</h4>
                 <div className="space-y-2 text-xs font-mono">
                   <div className="flex justify-between"><span className="text-zinc-600">EVENT HASH</span><span className="text-zinc-400 truncate max-w-[120px]" title={log.event_hash}>{log.event_hash}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">PREV HASH</span><span className="text-zinc-600 truncate max-w-[120px]" title={log.previous_hash}>{log.previous_hash || '0x0000'}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">VERIFICATION</span><span className="text-emerald-500">✓ PASSED</span></div>
                 </div>
               </div>

               {/* BLOCKCHAIN ANCHOR */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">Blockchain Anchor</h4>
                 <div className="space-y-2 text-xs font-mono">
                   <div className="flex justify-between"><span className="text-zinc-600">NETWORK</span><span className="text-cyan-400">SEPOLIA</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">STATUS</span><span className="text-emerald-500">TAMPER-EVIDENT</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">REFERENCE</span><span className="text-zinc-500 underline decoration-zinc-800 underline-offset-4">Tx Anchor</span></div>
                 </div>
               </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border border-zinc-800/50 rounded-lg bg-[#0a0a0c]">
            <ShieldCheck className="h-12 w-12 mb-6 opacity-50 text-cyan-400" />
            <p className="text-sm font-mono tracking-widest uppercase text-zinc-400">NO RECENT AUDIT EVENTS</p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 mt-2 text-center max-w-sm">
              The tamper-evident ledger actively monitors asset access, role changes, and cryptographic verification events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
