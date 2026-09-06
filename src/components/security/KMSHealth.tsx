'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { useDemoStore } from '@/stores/useDemoStore';

export function KMSHealth() {
  const { attackPathStage, activeThreat } = useDemoStore();
  
  const isLocked = attackPathStage === 'BLOCKED' && (activeThreat?.blockedAt === 'KMS' || activeThreat?.blockedAt === 'DOMAIN2');
  
  return (
    <Card className={`glass-panel border-white/5 ${isLocked ? 'border-destructive/50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" /> Key Management System
        </CardTitle>
        <CardDescription>Off-chain AES-256-GCM Envelope Encryption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between p-3 rounded-md bg-black/40 border border-white/5">
          <div className="flex items-center gap-3">
            {isLocked ? (
              <Lock className="w-5 h-5 text-destructive" />
            ) : (
              <Unlock className="w-5 h-5 text-emerald-500" />
            )}
            <div>
              <p className="text-sm font-medium leading-none">KMS Status</p>
              <p className="text-xs text-muted-foreground mt-1">Authorization State</p>
            </div>
          </div>
          <Badge variant="outline" className={`font-mono text-[10px] ${isLocked ? 'text-destructive border-destructive/30' : 'text-emerald-400 border-emerald-500/30'}`}>
            {isLocked ? 'LOCKED / DENIED' : 'ACTIVE'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active Policies</p>
            <p className="text-lg font-mono font-medium">12</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Temp Capabilities</p>
            <p className="text-lg font-mono font-medium">3</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Expired Capabilities</p>
            <p className="text-lg font-mono font-medium text-amber-500/80">45</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Revoked Capabilities</p>
            <p className="text-lg font-mono font-medium text-destructive/80">2</p>
          </div>
        </div>

        {isLocked && (
           <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded flex items-start gap-3">
             <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
             <div className="space-y-1">
               <p className="text-xs font-medium text-destructive">DECRYPTION DENIED</p>
               <p className="text-[10px] text-destructive/80">KMS refused to issue temporary decryption capability due to Domain 2 policy rejection.</p>
             </div>
           </div>
        )}

      </CardContent>
    </Card>
  );
}
