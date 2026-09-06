'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemoStore } from '@/stores/useDemoStore';
import { ShieldCheck, ShieldAlert, ArrowRight, Server, Key, Lock, Fingerprint, Users, FileLock2, Database, ShieldX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AttackPathVisualization() {
  const { attackPathStage, activeThreat } = useDemoStore();

  const stages = [
    { id: 'IDENTITY', label: 'Identity', icon: Fingerprint },
    { id: 'SESSION', label: 'Session', icon: Server },
    { id: 'RBAC', label: 'RBAC', icon: Users },
    { id: 'DOMAIN1', label: 'Domain 1', icon: FileLock2, desc: 'Asset Policy' },
    { id: 'DOMAIN2', label: 'Domain 2', icon: ShieldCheck, desc: 'Key Policy' },
    { id: 'KMS', label: 'KMS', icon: Key },
    { id: 'DECRYPTION', label: 'Decryption', icon: Lock }
  ];

  const getStageStatus = (stageId: string) => {
    if (attackPathStage === 'IDLE') return 'pending';
    
    const currentIndex = stages.findIndex(s => s.id === attackPathStage);
    const thisIndex = stages.findIndex(s => s.id === stageId);
    
    if (attackPathStage === 'BLOCKED') {
      const blockedIndex = stages.findIndex(s => s.id === activeThreat?.blockedAt);
      if (thisIndex < blockedIndex) return 'passed';
      if (thisIndex === blockedIndex) return 'blocked';
      return 'denied'; // Subsequent stages
    }

    if (thisIndex < currentIndex) return 'passed';
    if (thisIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm font-medium text-muted-foreground">
          <span>Security Fabric / Authorization Flow</span>
          {attackPathStage === 'BLOCKED' && (
            <Badge variant="destructive" className="animate-pulse font-mono text-[10px]">THREAT CONTAINED</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 overflow-x-auto pb-4">
          
          {/* Threat Entry */}
          <div className="flex flex-col items-center min-w-[60px] opacity-70">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeThreat ? 'bg-destructive/20 text-destructive animate-bounce' : 'bg-muted text-muted-foreground'}`}>
               <AlertIcon active={!!activeThreat} />
             </div>
             <span className="text-[10px] font-mono mt-2 text-center text-muted-foreground">THREAT</span>
          </div>

          {stages.map((stage, i) => {
            const status = getStageStatus(stage.id);
            const isLast = i === stages.length - 1;

            return (
              <React.Fragment key={stage.id}>
                <ArrowRight className={`w-4 h-4 shrink-0 ${status === 'passed' ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                
                <div className="flex flex-col items-center min-w-[70px] relative">
                  <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    status === 'passed' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                    status === 'active' ? 'border-amber-500 bg-amber-500/20 text-amber-500 scale-110 ' :
                    status === 'blocked' ? 'border-destructive bg-destructive/20 text-destructive scale-110 ' :
                    status === 'denied' ? 'border-destructive/30 bg-destructive/5 text-destructive/50' :
                    'border-muted/30 bg-muted/5 text-muted-foreground'
                  }`}>
                    <stage.icon className="w-5 h-5" />
                    {status === 'blocked' && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                        <ShieldX className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono mt-2 font-medium text-center">{stage.label}</span>
                  {stage.desc && <span className="text-[8px] text-muted-foreground text-center">{stage.desc}</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* The Authorization != Decryption visual */}
        {attackPathStage === 'BLOCKED' && activeThreat?.blockedAt === 'DOMAIN2' && (
          <div className="mt-8 p-4 border border-destructive/30 bg-black/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-destructive/5 stripe-pattern opacity-20" />
            
            <div className="z-10 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-6 text-sm font-mono">
                <div className="flex items-center gap-2 text-emerald-400"><CheckIcon /> ASSET PERMISSION</div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-2 text-destructive"><CrossIcon /> KEY POLICY</div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-2 text-destructive"><LockIcon /> KMS AUTHORIZATION</div>
              </div>
              
              <div className="bg-destructive/20 border-y border-destructive/50 w-full py-2">
                <h3 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-destructive">
                  AUTHORIZATION ≠ DECRYPTION
                </h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-md">
                Although Domain 1 (Asset Policy) authorized access based on RBAC, Domain 2 (Key Policy) detected a context violation (Token Replay) and denied the KMS decryption capability.
              </p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

const AlertIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const CheckIcon = () => <ShieldCheck className="w-4 h-4" />;
const CrossIcon = () => <ShieldX className="w-4 h-4" />;
const LockIcon = () => <Lock className="w-4 h-4" />;
