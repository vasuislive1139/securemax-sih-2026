'use client';

import React, { useEffect } from 'react';
import { useDemoStore } from '@/stores/useDemoStore';
import { Button } from '@/components/ui/button';
import { Play, Square, CheckCircle2, XCircle, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';

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
      resetDemo();
    } else {
      setPresentationMode(true);
      setPresentationStage(0);
    }
  };

  useEffect(() => {
    if (!presentationModeActive) return;

    let timeout: NodeJS.Timeout;

    switch (presentationStage) {
      case 0: // Phase 1: SYSTEM INITIALIZATION
        timeout = setTimeout(() => setPresentationStage(1), 3000);
        break;
      case 1: // Phase 2: NORMAL OPERATION
        timeout = setTimeout(() => setPresentationStage(2), 3000);
        break;
      case 2: // Phase 3: SECURITY CONTROL VALIDATION
        timeout = setTimeout(() => setPresentationStage(3), 4000);
        break;
      case 3: // Phase 4: TOKEN REPLAY ATTEMPT
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
          setTimeout(() => advanceAttackPath('BLOCKED'), 3000);
          setTimeout(() => setPresentationStage(4), 5000);
        }, 1500);
        break;
      case 4: // Phase 5: AUTHORIZATION ≠ DECRYPTION
        createIncident({
          threatId: 'demo-threat',
          title: 'SIMULATED ATTACK: Token Replay Blocked',
          severity: 'HIGH',
          status: 'OPEN',
          detectionLayer: 'Sentinel Engine',
          blockedLayer: 'Domain 2: Key Policy',
          affectedAsset: 'BEL-AVI-003',
          source: 'SANDBOX SIMULATION'
        });
        timeout = setTimeout(() => setPresentationStage(5), 8000);
        break;
      case 5: // Phase 6: INCIDENT INVESTIGATION
        timeout = setTimeout(() => setPresentationStage(6), 4000);
        break;
      case 6: // Phase 7: AUDIT
        timeout = setTimeout(() => setPresentationStage(7), 5000);
        break;
      case 7: // Phase 8: RECOVERY
        const state = useDemoStore.getState();
        if (state.incidents.length > 0) resolveIncident(state.incidents[0].id);
        timeout = setTimeout(() => setPresentationStage(8), 4000);
        break;
      case 8: // Done
        // Holds the final frame indefinitely until user clicks EXIT
        break;
    }

    return () => clearTimeout(timeout);
  }, [presentationModeActive, presentationStage, startSimulation, advanceAttackPath, createIncident, resolveIncident, setPresentationMode, setPresentationStage]);

  return (
    <>
      
      {presentationModeActive && presentationStage === 7 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-black/90 border border-emerald-500/40 p-8 rounded-lg shadow-[0_0_40px_rgba(16,185,129,0.2)] flex flex-col items-center">
            <h2 className="text-2xl font-mono text-emerald-500 mb-6 tracking-widest">THREAT CONTAINED</h2>
            <div className="space-y-3 font-mono text-sm w-72">
              <div className="flex justify-between"><span>Sentinel</span><span className="text-emerald-500">CLEAR</span></div>
              <div className="flex justify-between"><span>Domain 1</span><span className="text-emerald-500">HEALTHY</span></div>
              <div className="flex justify-between"><span>Domain 2</span><span className="text-emerald-500">HEALTHY</span></div>
              <div className="flex justify-between"><span>KMS</span><span className="text-emerald-500">PROTECTED</span></div>
              <div className="flex justify-between"><span>Audit</span><span className="text-emerald-500">VERIFIED</span></div>
            </div>
          </div>
        </div>
      )}

      
      {presentationModeActive && presentationStage === 3 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="bg-black/90 border border-red-500/60 p-8 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] flex flex-col items-center">
            <h2 className="text-3xl font-mono text-red-500 mb-6 font-bold glow-text">TOKEN REPLAY ATTEMPT</h2>
            <div className="space-y-4 font-mono text-sm w-72 text-center">
              <div className="text-zinc-300">Sentinel Engine: <span className="text-red-500 font-bold">THREAT DETECTED</span></div>
              <div className="text-zinc-300">Policy Enforcement: <span className="text-red-500 font-bold">ACCESS BLOCKED</span></div>
              <div className="text-zinc-300">SOC Response: <span className="text-red-500 font-bold">INCIDENT CREATED</span></div>
            </div>
          </div>
        </div>
      )}

      
      {presentationModeActive && presentationStage === 5 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-[#050505] border border-red-500/30 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            <h3 className="text-red-500 font-mono font-bold mb-4 flex items-center gap-2 tracking-widest"><ShieldAlert className="w-5 h-5"/> INCIDENT INVESTIGATION</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm font-mono text-zinc-300">
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Incident ID</span>
                <span className="text-red-400">INC-{(Math.random()*1000000).toFixed(0)}</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Attack Type</span>
                <span>Token Replay</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Detection Layer</span>
                <span className="text-amber-500">Sentinel Engine</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase mb-1">Blocked Layer</span>
                <span className="text-emerald-500">Domain 2 (KMS)</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
               <h4 className="text-zinc-500 text-[10px] uppercase font-mono mb-3">Timeline</h4>
               <div className="space-y-3 font-mono text-xs">
                 <div className="flex gap-4"><span className="text-zinc-600">00:00:01</span><span className="text-zinc-300">ATTEMPT LOGGED</span></div>
                 <div className="flex gap-4"><span className="text-zinc-600">00:00:02</span><span className="text-amber-500">DETECTED BY SENTINEL</span></div>
                 <div className="flex gap-4"><span className="text-zinc-600">00:00:02</span><span className="text-emerald-500">POLICY ENFORCED (DENIED)</span></div>
                 <div className="flex gap-4"><span className="text-zinc-600">00:00:03</span><span className="text-cyan-400">AUDITED & ANCHORED</span></div>
               </div>
            </div>
          </div>
        </div>
      )}

      
      {presentationModeActive && presentationStage === 1 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="bg-[#050505] border border-emerald-500/30 p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl font-mono text-emerald-400 mb-6 tracking-widest glow-text">NORMAL OPERATION</h2>
            <div className="space-y-3 font-mono text-sm w-80 text-center">
              <div className="flex justify-between"><span>Ethereum Sepolia</span><span className="text-emerald-500">✓ ACTIVE</span></div>
              <div className="flex justify-between"><span>Healthy Contracts</span><span className="text-emerald-500">✓ VERIFIED</span></div>
              <div className="flex justify-between"><span>Identity</span><span className="text-emerald-500">✓ VERIFIED</span></div>
              <div className="flex justify-between"><span>RBAC</span><span className="text-emerald-500">✓ ENFORCED</span></div>
              <div className="flex justify-between"><span>KMS</span><span className="text-emerald-500">✓ PROTECTED</span></div>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/20 text-emerald-500 tracking-widest font-bold">
              SECURITY POSTURE HEALTHY
            </div>
          </div>
        </div>
      )}

      {/* Narrative Timeline overlay */}
      {presentationModeActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-primary/30 shadow-2xl shadow-primary/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="animate-pulse flex h-3 w-3 rounded-full bg-primary"></span>
              <span className="font-mono font-bold tracking-widest text-primary text-sm sm:text-base">PRESENTATION MODE</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {PHASES.map((phase, idx) => (
                <div key={phase} className={`flex items-center font-mono text-[10px] sm:text-xs px-2 py-1 rounded-sm whitespace-nowrap transition-colors ${presentationStage === idx ? 'bg-primary text-black font-bold' : presentationStage > idx ? 'text-emerald-500' : 'text-zinc-600'}`}>
                  {idx + 1}. {phase}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAYS based on Phase */}
      {presentationModeActive && presentationStage === 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-black/90 border border-primary/40 p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl font-mono text-primary mb-6">SYSTEM INITIALIZATION</h2>
            <div className="space-y-3 font-mono text-sm w-64">
              <div className="flex justify-between"><span>Identity</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>Domain 1</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>Domain 2</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>KMS</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>Sentinel</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>Audit</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
            </div>
          </div>
        </div>
      )}

      {presentationModeActive && presentationStage === 2 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-black/90 border border-amber-500/40 p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h2 className="text-2xl font-mono text-amber-500 mb-6">SECURITY CONTROL VALIDATION</h2>
            <div className="space-y-3 font-mono text-sm w-80">
              <div className="flex justify-between"><span>1. Unauthorized Asset Access</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>2. Expired Temporary Key</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>3. Revoked Permission Access</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between"><span>4. Privilege Escalation</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex justify-between text-primary font-bold"><span>5. Token Replay Attempt</span><span className="text-[10px] animate-pulse">INITIATING...</span></div>
            </div>
          </div>
        </div>
      )}

      {presentationModeActive && presentationStage === 4 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-none">
          <div className="bg-[#0a0a0c] border-2 border-red-500/50 p-10 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] flex flex-col items-center">
            <h1 className="text-4xl font-bold font-mono text-red-500 mb-2 glow-text">AUTHORIZATION ≠ DECRYPTION</h1>
            <p className="text-zinc-400 font-mono text-sm mb-8 tracking-widest text-center">DOMAIN 1 AUTHORIZATION DOES NOT BYPASS DOMAIN 2 CRYPTOGRAPHY</p>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 font-mono text-sm w-full max-w-2xl">
              <div className="space-y-4 col-span-1 border-r border-zinc-800 pr-8">
                <h3 className="text-zinc-500 mb-4 border-b border-zinc-800 pb-2">EDGE & DOMAIN 1</h3>
                <div className="flex justify-between"><span>Identity</span><span className="text-emerald-500">✓ VERIFIED</span></div>
                <div className="flex justify-between"><span>Session</span><span className="text-emerald-500">✓ VALID</span></div>
                <div className="flex justify-between"><span>RBAC</span><span className="text-emerald-500">✓ AUTHORIZED</span></div>
                <div className="flex justify-between"><span>Asset Auth</span><span className="text-emerald-500">✓ ALLOWED</span></div>
              </div>
              
              <div className="space-y-4 col-span-1 pl-4">
                <h3 className="text-zinc-500 mb-4 border-b border-zinc-800 pb-2">DOMAIN 2 & KMS</h3>
                <div className="flex justify-between"><span>Key Auth</span><span className="text-red-500">✕ ACCESS DENIED</span></div>
                <div className="flex justify-between"><span>KMS</span><span className="text-amber-500 flex items-center gap-1"><Lock className="w-3 h-3"/> LOCKED</span></div>
                <div className="flex justify-between"><span>Decryption</span><span className="text-red-500">✕ DECRYPTION DENIED</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {presentationModeActive && presentationStage === 6 && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end p-12 pointer-events-none">
          <div className="bg-black/90 border-l-4 border-cyan-500 p-6 rounded shadow-2xl max-w-md">
            <h3 className="text-cyan-400 font-mono font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> TAMPER-EVIDENT AUDIT</h3>
            <div className="space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between"><span>Audit Event</span><span className="text-zinc-300">✓ HASHED</span></div>
              <div className="flex justify-between"><span>Chain Integrity</span><span className="text-emerald-500">✓ VERIFIED</span></div>
              <div className="flex justify-between"><span>Blockchain Anchor</span><span className="text-cyan-400">✓ CONFIRMED</span></div>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono break-all bg-zinc-950 p-2 border border-zinc-800 rounded">
              Current Hash: 0x9a8f4c2...71e4b09<br/>
              Previous Hash: 0x3f1b...8a12<br/>
              Timestamp: {new Date().toISOString()}
            </div>
            <div className="mt-4 pt-3 border-t border-cyan-500/30 text-center font-bold text-emerald-500 tracking-widest text-sm">
              INTEGRITY VERIFIED
            </div>
          </div>
        </div>
      )}

      
      {presentationModeActive && presentationStage === 8 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#050505] backdrop-blur-xl pointer-events-auto">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-5xl font-extrabold tracking-widest text-primary glow-text">SECUREMAX</h1>
            <div className="text-xl font-mono text-emerald-400 tracking-widest bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/30">
              SECURITY FABRIC: OPERATIONAL
            </div>
            
            <div className="h-16"></div>
            
            <h2 className="text-3xl font-bold font-mono text-red-500 tracking-widest glow-text">AUTHORIZATION ≠ DECRYPTION</h2>
            
            <div className="h-4"></div>
            
            <p className="text-sm font-mono text-zinc-400 max-w-3xl text-center leading-loose">
              Cryptographic Identity • Policy Enforcement • Independent Key Security • Threat Detection • Tamper-Evident Audit
            </p>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={togglePresentation} 
          variant={presentationModeActive ? "destructive" : "default"}
          className={`shadow-2xl font-mono font-bold border border-primary/50 ${presentationModeActive ? 'animate-pulse' : 'bg-primary/90 text-black hover:bg-primary'}`}
        >
          {presentationModeActive ? (
            <><Square className="w-4 h-4 mr-2" /> EXIT PRESENTATION</>
          ) : (
            <><Play className="w-4 h-4 mr-2" /> START PRESENTATION</>
          )}
        </Button>
      </div>
    </>
  );
}
