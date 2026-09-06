'use client';

import * as React from 'react';
import { List, Link2, ShieldCheck, Database, Search, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/stores/useDemoStore';

export default function AuditTrailPage() {
  const { incidents } = useDemoStore();
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  // Generate dynamic audit trail based on incidents
  const baseAudit = [
    { id: 'EVT-004', type: 'DECRYPTION_COMPLETED', actor: 'Aarav Mehta (ADMIN)', target: 'BEL-RDR-001', hash: '0x8f2a...c391', prevHash: '0xe2a4...f9d1', time: '10 mins ago', result: 'SUCCESS' },
    { id: 'EVT-003', type: 'KMS_CAPABILITY_ISSUED', actor: 'SYSTEM_KMS', target: 'BEL-RDR-001', hash: '0xe2a4...f9d1', prevHash: '0x7b2c...a11e', time: '11 mins ago', result: 'SUCCESS' },
    { id: 'EVT-002', type: 'DOMAIN_2_AUTH_CHECK', actor: '0x222...222', target: 'BEL-RDR-001', hash: '0x7b2c...a11e', prevHash: '0x4f92...c88d', time: '12 mins ago', result: 'SUCCESS' },
    { id: 'EVT-001', type: 'DOMAIN_1_AUTH_CHECK', actor: '0x333...333', target: 'BEL-RDR-001', hash: '0x4f92...c88d', prevHash: '0x0000...0000', time: '12 mins ago', result: 'SUCCESS' },
  ];

  let displayAudit = [...baseAudit];

  if (incidents.length > 0) {
    const inc = incidents[0];
    const demoEvents = [
      { id: 'EVT-007', type: 'SECURITY_INCIDENT_CREATED', actor: 'SENTINEL', target: inc.affectedAsset, hash: '0x99ff...11aa', prevHash: '0x55bb...22cc', time: 'Just now', result: 'SUCCESS' },
      { id: 'EVT-006', type: 'DECRYPTION_DENIED', actor: 'SYSTEM_KMS', target: inc.affectedAsset, hash: '0x55bb...22cc', prevHash: '0x11aa...99ff', time: 'Just now', result: 'DENIED' },
      { id: 'EVT-005', type: 'DOMAIN_2_AUTH_CHECK', actor: 'UNKNOWN (SANDBOX)', target: inc.affectedAsset, hash: '0x11aa...99ff', prevHash: '0x8f2a...c391', time: 'Just now', result: 'DENIED (POLICY VIOLATION)' },
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <List className="mr-3 h-8 w-8 text-primary" />
            Tamper-Evident Audit Trail
          </h2>
          <p className="text-muted-foreground mt-1">Blockchain-Anchored Forensics Log</p>
        </div>
        <Button 
          variant={verified ? "outline" : "default"} 
          className={`mt-4 sm:mt-0 font-mono ${verified ? 'border-emerald-500 text-emerald-400' : ''}`}
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? (
            <><Database className="mr-2 h-4 w-4 animate-bounce" /> VERIFYING BLOCKCHAIN...</>
          ) : verified ? (
            <><ShieldCheck className="mr-2 h-4 w-4" /> INTEGRITY VERIFIED</>
          ) : (
            <><Database className="mr-2 h-4 w-4" /> VERIFY INTEGRITY</>
          )}
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-center">
        <p className="text-xs font-mono text-primary/80">CRYPTOGRAPHIC HASH CHAIN VISUALIZATION</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Chain Visualization */}
        <div className="lg:col-span-1 space-y-2 relative">
          <div className="absolute left-6 top-8 bottom-8 w-1 bg-border/50 rounded-full" />
          {displayAudit.map((log, idx) => (
            <Card key={log.id} className={`glass-panel border-white/5 relative z-10 ${verified ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
              <CardContent className="p-4 flex items-start gap-4">
                 <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${verified ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground'}`} />
                 <div className="space-y-2 w-full">
                   <div className="flex justify-between items-center">
                     <span className="font-mono text-xs font-bold">{log.id}</span>
                     <span className="text-[10px] text-muted-foreground">{log.time}</span>
                   </div>
                   <div className="bg-black/40 p-2 rounded border border-white/5 text-[10px] font-mono space-y-1">
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">HASH:</span>
                       <span className={verified ? 'text-emerald-400' : 'text-foreground'}>{log.hash}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">PREV:</span>
                       <span className="text-muted-foreground/70">{log.prevHash}</span>
                     </div>
                   </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Table */}
        <Card className="glass-panel border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle>Forensic Event Details</CardTitle>
            <CardDescription>Decoded payload data from anchored events.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground text-xs uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Event ID</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium">Actor</th>
                    <th className="px-6 py-3 font-medium">Resource</th>
                    <th className="px-6 py-3 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayAudit.map((log) => (
                    <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{log.id}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground text-xs">{log.type}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.actor}</td>
                      <td className="px-6 py-4 font-mono text-xs">{log.target}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[10px] ${log.result.includes('SUCCESS') ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-destructive border-destructive/30 bg-destructive/10'}`}>
                          {log.result}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
