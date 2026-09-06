'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/stores/useDemoStore';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

const PHASES = [
  "INITIALIZATION",
  "NORMAL OPERATION",
  "SECURITY CONTROL VALIDATION",
  "TOKEN REPLAY ATTEMPT",
  "AUTHORIZATION ≠ DECRYPTION",
  "INCIDENT INVESTIGATION",
  "AUDIT",
  "RECOVERY"
];

export function PresentationMode() {
  const router = useRouter();
  const { 
    presentationModeActive, 
    setPresentationMode, 
    presentationStage, 
    setPresentationStage,
    startSimulation,
    advanceAttackPath,
    createIncident,
    resolveIncident,
    resetDemo
  } = useDemoStore();

  const togglePresentation = () => {
    if (presentationModeActive) {
      setPresentationMode(false);
      resetDemo();
      router.push('/');
    } else {
      resetDemo();
      setPresentationMode(true);
      router.push('/');
    }
  };

  useEffect(() => {
    if (!presentationModeActive) return;

    let timeout: NodeJS.Timeout;

    switch (presentationStage) {
      case 0: // Phase 1: SYSTEM INITIALIZATION
        router.push('/');
        timeout = setTimeout(() => setPresentationStage(1), 8000);
        break;
      case 1: // Phase 2: NORMAL OPERATION
        router.push('/');
        timeout = setTimeout(() => setPresentationStage(2), 6000);
        break;
      case 2: // Phase 3: SECURITY CONTROL VALIDATION
        router.push('/security/sentinel');
        timeout = setTimeout(() => setPresentationStage(3), 6000);
        break;
      case 3: // Phase 4: TOKEN REPLAY ATTEMPT
        router.push('/security/sentinel');
        startSimulation({
          type: 'token_replay',
          name: 'Token Replay Attempt',
          severity: 'HIGH',
          description: '[CONTROLLED SECURITY TEST] A captured token was replayed.',
          blockedAt: 'DOMAIN2'
        });
        advanceAttackPath('SESSION');
        timeout = setTimeout(() => {
          advanceAttackPath('RBAC');
          setTimeout(() => advanceAttackPath('DOMAIN1'), 1000);
          setTimeout(() => advanceAttackPath('DOMAIN2'), 2000);
          setTimeout(() => {
            advanceAttackPath('BLOCKED');
            createIncident({
              threatId: 'sim-1',
              title: 'Token Replay Attempt',
              severity: 'HIGH',
              status: 'OPEN',
              detectionLayer: 'Sentinel Engine',
              blockedLayer: 'Domain 2 (KMS)',
              affectedAsset: 'Asset-7A',
              source: '192.168.1.100'
            });
            setPresentationStage(4);
          }, 3000);
        }, 1000);
        break;
      case 4: // Phase 5: AUTHORIZATION ≠ DECRYPTION
        router.push('/');
        timeout = setTimeout(() => setPresentationStage(5), 7000);
        break;
      case 5: // Phase 6: INCIDENT INVESTIGATION
        router.push('/security/incidents');
        timeout = setTimeout(() => setPresentationStage(6), 6000);
        break;
      case 6: // Phase 7: AUDIT
        router.push('/audit');
        timeout = setTimeout(() => setPresentationStage(7), 6000);
        break;
      case 7: // Phase 8: RECOVERY
        router.push('/dashboard/soc');
        resolveIncident('all');
        timeout = setTimeout(() => setPresentationStage(8), 5000);
        break;
      case 8: // END
        router.push('/');
        break;
    }

    return () => clearTimeout(timeout);
  }, [presentationModeActive, presentationStage, startSimulation, advanceAttackPath, createIncident, resolveIncident, setPresentationStage, router]);

  return (
    <>
      {presentationModeActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c] border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="animate-pulse flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span className="font-mono font-bold tracking-widest text-zinc-100 text-xs sm:text-sm">PRESENTATION MODE</span>
            </div>
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="font-mono text-[10px] sm:text-xs text-zinc-500 hidden sm:inline">
                PHASE {Math.min(presentationStage + 1, 8)} / {PHASES.length}
              </span>
              <div className="flex items-center font-mono text-[10px] sm:text-xs px-3 py-1.5 rounded-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap truncate max-w-[200px] sm:max-w-none">
                {PHASES[Math.min(presentationStage, 7)] || "COMPLETED"}
              </div>
            </div>
          </div>
        </div>
      )}

      {presentationModeActive && presentationStage === 4 && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-[#0a0a0c]/90 backdrop-blur-md border-2 border-red-500/50 p-8 rounded-lg shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-red-500 mb-2">AUTHORIZATION ≠ DECRYPTION</h1>
            <p className="text-zinc-400 font-mono text-[10px] sm:text-xs tracking-widest text-center">ASSET AUTHORIZATION DOES NOT AUTOMATICALLY GRANT ACCESS TO THE ENCRYPTION KEY</p>
          </div>
        </div>
      )}

      {presentationModeActive && presentationStage === 7 && (
        <div className="fixed bottom-24 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-12 z-40 flex flex-col items-end pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-[#0a0a0c]/90 backdrop-blur-md border border-emerald-500/30 p-6 rounded-lg shadow-2xl flex flex-col items-center sm:items-end">
            <h1 className="text-xl font-bold font-mono text-zinc-100 tracking-widest">SECURE<span className="text-cyan-400">MAX</span></h1>
            <p className="text-emerald-500 font-mono text-[10px] tracking-widest mt-1">SECURITY FABRIC OPERATIONAL</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={togglePresentation} 
          variant="outline"
          className={`font-mono text-xs tracking-widest px-6 py-4 transition-all duration-300 ${presentationModeActive ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-[#0a0a0c] text-zinc-100 hover:bg-zinc-900 border-zinc-800'}`}
        >
          {presentationModeActive ? (
            <><Square className="w-3 h-3 mr-2" /> EXIT PRESENTATION</>
          ) : (
            <><Play className="w-3 h-3 mr-2 text-cyan-400" /> START PRESENTATION</>
          )}
        </Button>
      </div>
    </>
  );
}
