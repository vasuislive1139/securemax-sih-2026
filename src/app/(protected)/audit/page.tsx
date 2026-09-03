'use client';

import * as React from 'react';
import { List, Link2, ShieldCheck, Database, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AuditTrailPage() {
  const mockAudit = [
    { id: 1042, type: 'DECRYPTION_COMPLETED', actor: '0x333...333', target: 'BEL-RDR-001', hash: 'e2a4...f9d1', prevHash: '7b2c...a11e', time: '10 mins ago', status: 'ANCHORED' },
    { id: 1041, type: 'TEMPORARY_KEY_AUTHORIZED', actor: 'SYSTEM_KMS', target: 'BEL-RDR-001', hash: '7b2c...a11e', prevHash: '4f92...c88d', time: '11 mins ago', status: 'ANCHORED' },
    { id: 1040, type: 'ACCESS_GRANTED', actor: '0x222...222', target: 'BEL-RDR-001', hash: '4f92...c88d', prevHash: '1a7e...9b4c', time: '12 mins ago', status: 'ANCHORED' },
    { id: 1039, type: 'ACCESS_REQUESTED', actor: '0x333...333', target: 'BEL-RDR-001', hash: '1a7e...9b4c', prevHash: 'c5d3...6a1f', time: '2 hours ago', status: 'ANCHORED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <List className="mr-3 h-8 w-8 text-primary" />
            Audit Trail
          </h2>
          <p className="text-muted-foreground">Immutable, hash-chained logs anchored to Chain-1.</p>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0">
          <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
          Verify Hash Chain
        </Button>
      </div>

      <Card className="glass-panel">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, actors, or targets..."
                className="pl-8 bg-background/50"
              />
            </div>
            <Button variant="secondary">Filter Types</Button>
            <Button variant="secondary">Export JSON</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground text-xs uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Event ID</th>
                  <th className="px-6 py-3 font-medium">Event Type</th>
                  <th className="px-6 py-3 font-medium">Actor</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                  <th className="px-6 py-3 font-medium">Hash Link</th>
                  <th className="px-6 py-3 font-medium">Anchor</th>
                  <th className="px-6 py-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockAudit.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs">{log.id}</td>
                    <td className="px-6 py-3">
                      <span className="font-semibold text-foreground text-xs">{log.type}</span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{log.actor}</td>
                    <td className="px-6 py-3 font-mono text-xs">{log.target}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col text-[10px] font-mono text-muted-foreground">
                        <span className="flex items-center text-foreground">
                          H: {log.hash}
                        </span>
                        <span className="flex items-center text-muted-foreground/70">
                          <Link2 className="h-3 w-3 mr-1" />
                          P: {log.prevHash}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        <Database className="h-3 w-3 mr-1" />
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                      {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
