'use client';

import * as React from 'react';
import { Database, ShieldCheck, FileText, ChevronDown } from 'lucide-react';
import { useDemoStore } from '@/stores/useDemoStore';

export default function AuditTrailPage() {
  const { incidents } = useDemoStore();
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  const baseAudit = [
    { id: 'EVT-004', type: 'DECRYPTION_COMPLETED', actor: 'Aarav Mehta (ADMIN)', target: 'BEL-RDR-001', hash: '0x8f2a...c391', prevHash: '0xe2a4...f9d1', time: '10:04:12', result: 'SUCCESS' },
    { id: 'EVT-003', type: 'KMS_CAPABILITY_ISSUED', actor: 'SYSTEM_KMS', target: 'BEL-RDR-001', hash: '0xe2a4...f9d1', prevHash: '0x7b2c...a11e', time: '10:04:11', result: 'SUCCESS' },
    { id: 'EVT-002', type: 'DOMAIN_2_AUTH_CHECK', actor: '0x222...222', target: 'BEL-RDR-001', hash: '0x7b2c...a11e', prevHash: '0x4f92...c88d', time: '10:04:09', result: 'SUCCESS' },
    { id: 'EVT-001', type: 'DOMAIN_1_AUTH_CHECK', actor: '0x333...333', target: 'BEL-RDR-001', hash: '0x4f92...c88d', prevHash: '0x0000...0000', time: '10:04:08', result: 'SUCCESS' },
  ];

  let displayAudit = [...baseAudit];

  if (incidents.length > 0) {
    const inc = incidents[0];
    const demoEvents = [
      { id: 'EVT-007', type: 'SECURITY_INCIDENT_CREATED', actor: 'SENTINEL', target: inc.affectedAsset, hash: '0x99ff...11aa', prevHash: '0x55bb...22cc', time: '10:14:24', result: 'SUCCESS' },
      { id: 'EVT-006', type: 'DECRYPTION_DENIED', actor: 'SYSTEM_KMS', target: inc.affectedAsset, hash: '0x55bb...22cc', prevHash: '0x11aa...99ff', time: '10:14:23', result: 'DENIED' },
      { id: 'EVT-005', type: 'DOMAIN_2_AUTH_CHECK', actor: 'UNKNOWN (SANDBOX)', target: inc.affectedAsset, hash: '0x11aa...99ff', prevHash: '0x8f2a...c391', time: '10:14:22', result: 'DENIED' },
    ];
    displayAudit = [...demoEvents, ...baseAudit];
  }

  const handleVerify = () => {
    setVerifying(true);
    setVerified(false);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2000);
  };

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
        <button 
          onClick={handleVerify}
          disabled={verifying}
          className={`mt-4 sm:mt-0 font-mono text-xs tracking-widest uppercase px-6 py-3 rounded flex items-center transition-colors ${verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-100 text-zinc-950 hover:bg-white'}`}
        >
          {verifying ? (
            <><Database className="mr-2 h-4 w-4 animate-bounce" /> VERIFYING BLOCKCHAIN...</>
          ) : verified ? (
            <><ShieldCheck className="mr-2 h-4 w-4" /> INTEGRITY VERIFIED</>
          ) : (
            <><Database className="mr-2 h-4 w-4" /> VERIFY CHAIN INTEGRITY</>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {displayAudit.map((log) => (
          <div key={log.id} className="bg-[#0a0a0c] border border-zinc-800 rounded-lg overflow-hidden">
            <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-16 text-[10px] font-mono text-zinc-500">{log.time}</div>
                <div className="text-xs font-bold tracking-widest text-zinc-100 uppercase">{log.type}</div>
                <div className={`text-[10px] font-mono tracking-widest px-3 py-1 rounded ${log.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {log.result}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* AUDIT EVENT */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">Audit Event</h4>
                 <div className="space-y-2 text-xs font-mono">
                   <div className="flex justify-between"><span className="text-zinc-600">EVENT ID</span><span className="text-zinc-300">{log.id}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">ACTOR</span><span className="text-zinc-300 truncate max-w-[120px]">{log.actor}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">ACTION</span><span className="text-zinc-300 truncate max-w-[120px]">{log.type}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">ASSET</span><span className="text-cyan-400">{log.target}</span></div>
                 </div>
               </div>

               {/* INTEGRITY */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">Integrity</h4>
                 <div className="space-y-2 text-xs font-mono">
                   <div className="flex justify-between"><span className="text-zinc-600">EVENT HASH</span><span className="text-zinc-400">{log.hash}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">PREV HASH</span><span className="text-zinc-600">{log.prevHash}</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">VERIFICATION</span><span className={verified ? 'text-emerald-500' : 'text-zinc-500'}>{verified ? '✓ PASSED' : 'PENDING'}</span></div>
                 </div>
               </div>

               {/* BLOCKCHAIN ANCHOR */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-2 border-b border-zinc-800">Blockchain Anchor</h4>
                 <div className="space-y-2 text-xs font-mono">
                   <div className="flex justify-between"><span className="text-zinc-600">NETWORK</span><span className="text-cyan-400">SEPOLIA</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">STATUS</span><span className="text-emerald-500">TAMPER-EVIDENT</span></div>
                   <div className="flex justify-between"><span className="text-zinc-600">REFERENCE</span><span className="text-zinc-500 underline decoration-zinc-800 underline-offset-4">0x4b7...9e2</span></div>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
