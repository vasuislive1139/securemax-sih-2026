'use client';

import * as React from 'react';
import { Activity, ShieldAlert, CheckCircle2, XCircle, Play, Server, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/stores/useDemoStore';

export default function SentinelPage() {
  const { startSimulation, createIncident, advanceAttackPath, systemState } = useDemoStore();
  const [isRunning, setIsRunning] = React.useState(false);
  const [activeTest, setActiveTest] = React.useState<string | null>(null);

  // Exact 5 checks implemented
  const testCases = [
    { id: 'SEC-01', type: 'unauthorized_access', name: 'Unauthorized Asset Access', status: 'PASS', time: '12ms', layer: 'DOMAIN1' },
    { id: 'SEC-02', type: 'expired_key', name: 'Expired Temporary Key', status: 'PASS', time: '8ms', layer: 'KMS' },
    { id: 'SEC-03', type: 'revoked_permission', name: 'Revoked Permission Access', status: 'PASS', time: '14ms', layer: 'DOMAIN1' },
    { id: 'SEC-04', type: 'privilege_escalation', name: 'Privilege Escalation', status: 'PASS', time: '45ms', layer: 'RBAC' },
    { id: 'SEC-05', type: 'token_replay', name: 'Token Replay Attempt', status: 'PASS', time: '102ms', layer: 'DOMAIN2' },
  ];

  const runSimulation = (tc: any) => {
    if (systemState !== 'NORMAL' && systemState !== 'RECOVERED') {
      alert("Please resolve existing incidents before running a new simulation.");
      return;
    }

    setIsRunning(true);
    setActiveTest(tc.id);

    // 1. Create Threat
    startSimulation({
      type: tc.type,
      name: tc.name,
      severity: tc.type === 'token_replay' ? 'HIGH' : 'CRITICAL',
      description: `Controlled Sandbox Simulation: Injecting ${tc.name} threat packet.`,
      blockedAt: tc.layer as any
    });

    // 2. Advance Path
    setTimeout(() => advanceAttackPath('SESSION'), 500);
    setTimeout(() => advanceAttackPath('RBAC'), 1000);
    
    setTimeout(() => {
      if (tc.layer === 'RBAC') {
        advanceAttackPath('BLOCKED');
      } else {
        advanceAttackPath('DOMAIN1');
        
        setTimeout(() => {
          if (tc.layer === 'DOMAIN1') {
            advanceAttackPath('BLOCKED');
          } else {
            advanceAttackPath('DOMAIN2');
            
            setTimeout(() => {
              if (tc.layer === 'DOMAIN2') {
                advanceAttackPath('BLOCKED');
              } else {
                advanceAttackPath('KMS');
                
                setTimeout(() => {
                  advanceAttackPath('BLOCKED');
                }, 500);
              }
            }, 500);
          }
        }, 500);
      }
    }, 1500);

    // 3. Block & Incident
    const totalTime = tc.layer === 'RBAC' ? 2000 : tc.layer === 'DOMAIN1' ? 2500 : tc.layer === 'DOMAIN2' ? 3000 : 3500;
    setTimeout(() => {
      createIncident({
        threatId: tc.id,
        title: `Simulated ${tc.name} Blocked`,
        severity: tc.type === 'token_replay' ? 'HIGH' : 'CRITICAL',
        status: 'OPEN',
        detectionLayer: 'Sentinel Engine',
        blockedLayer: `Layer: ${tc.layer}`,
        affectedAsset: 'BEL-AVI-003',
        source: 'SANDBOX SIMULATION'
      });
      setIsRunning(false);
      setActiveTest(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <Activity className="mr-3 h-8 w-8 text-primary glow-cyan" />
            Sentinel Security Center
          </h2>
          <p className="text-muted-foreground mt-1">Deterministic security validation and automated posture assessment.</p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-center">
        <p className="text-xs font-mono text-primary/80">CONTROLLED SANDBOX SIMULATION AREA — NO PRODUCTION IMPACT</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-panel md:col-span-1 tech-border">
          <CardHeader>
            <CardTitle className="text-lg">Sentinel Health</CardTitle>
            <CardDescription>Engine Status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <Server className="h-4 w-4 mr-2" /> Environment
              </span>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-[10px]">SANDBOX</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Last Check
              </span>
              <span className="font-mono text-xs">Real-time</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <ShieldAlert className="h-4 w-4 mr-2 text-emerald-400" /> State
              </span>
              <span className="font-bold text-emerald-400 font-mono">ACTIVE</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel md:col-span-3 tech-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Implemented Security Controls</CardTitle>
              <CardDescription>
                Run deterministic application-level security probes.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testCases.map((tc) => {
                const isActive = activeTest === tc.id;

                return (
                  <div key={tc.id} className={`flex items-center justify-between p-3 rounded-md border ${isActive ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/5 bg-black/40'} transition-colors`}>
                    <div className="flex items-center space-x-3">
                       <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <div>
                        <span className="font-mono text-xs text-muted-foreground mr-2">{tc.id}</span>
                        <span className={`text-sm font-medium ${isActive ? 'text-amber-500' : 'text-foreground'}`}>{tc.name}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={`font-mono text-[10px] h-8 ${isActive ? 'border-amber-500 text-amber-500' : 'hover:border-primary hover:text-primary'}`}
                      disabled={isRunning}
                      onClick={() => runSimulation(tc)}
                    >
                      {isActive ? (
                         <><Activity className="w-3 h-3 mr-2 animate-spin" /> EXECUTING...</>
                      ) : (
                         <><Play className="w-3 h-3 mr-2" /> RUN ASSESSMENT</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
