'use client';

import React, { useState, useEffect } from 'react';
import { Fingerprint, Layers, Database, Key, Shield, Lock, Activity, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Hexagon } from 'lucide-react';
import { PresentationMode } from '@/components/dashboard/PresentationMode';

export default function CyberCommandInterface() {
  const [activeEvent, setActiveEvent] = useState(0);

  // Simple event stream ticker for the demo video
  const events = [
    { time: '10:14:18', type: 'AUTHENTICATION', message: 'Cryptographic identity verified', status: 'SUCCESS' },
    { time: '10:14:21', type: 'AUTHORIZATION', message: 'RBAC context evaluation passed', status: 'SUCCESS' },
    { time: '10:14:24', type: 'DOMAIN 1', message: 'Asset authorization granted', status: 'SUCCESS' },
    { time: '10:14:28', type: 'DOMAIN 2', message: 'Decryption key policy evaluated', status: 'SUCCESS' },
    { time: '10:14:32', type: 'KMS', message: 'Temporary decryption authorized', status: 'SUCCESS' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEvent(prev => (prev + 1) % events.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [events.length]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent"></div>
      
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-[#0a0a0c] px-6 z-10 relative">
        <div className="flex items-center gap-4">
          <Hexagon className="h-6 w-6 text-cyan-400" />
          <span className="text-lg font-bold tracking-widest text-zinc-100">SECURE<span className="text-cyan-400">MAX</span></span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            SECURITY FABRIC: OPERATIONAL
          </div>
          <a href="/login" className="text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-4 py-1.5 rounded-sm hover:bg-cyan-500/10 transition-colors">
            ACCESS COMMAND CENTER
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SYSTEM HEALTH */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0a0a0c] border border-zinc-800 rounded-lg p-5">
            <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 mb-6 uppercase">Security Posture</h3>
            <div className="text-5xl font-light tracking-tighter text-zinc-100 mb-2">92<span className="text-xl text-zinc-600">/100</span></div>
            <div className="text-xs font-mono text-emerald-400 tracking-widest">HEALTHY</div>
            
            <div className="mt-8 space-y-4 text-xs font-mono tracking-wider">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Identity</span>
                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> HEALTHY</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Domain 1</span>
                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> HEALTHY</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Domain 2</span>
                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> HEALTHY</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">KMS</span>
                <span className="text-cyan-400 flex items-center gap-1"><Lock className="w-3 h-3"/> PROTECTED</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Sentinel</span>
                <span className="text-emerald-500 flex items-center gap-1"><Activity className="w-3 h-3"/> ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Audit</span>
                <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: ARCHITECTURE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-start">
          <div className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-lg p-6 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-zinc-600">ETHEREUM SEPOLIA</div>
            
            <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4 pt-4">
              
              <div className="w-full flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/50 rounded">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-zinc-400" />
                  <div>
                    <div className="text-xs font-bold tracking-widest">IDENTITY</div>
                    <div className="text-[10px] text-zinc-500">Cryptographic authentication</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-emerald-500">● VERIFIED</div>
              </div>
              
              <div className="w-px h-6 bg-zinc-800"></div>

              <div className="w-full flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/50 rounded">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-zinc-400" />
                  <div>
                    <div className="text-xs font-bold tracking-widest">RBAC + CONTEXT</div>
                    <div className="text-[10px] text-zinc-500">Role evaluation</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-emerald-500">● ENFORCED</div>
              </div>

              <div className="w-px h-6 bg-zinc-800"></div>

              {/* DOMAIN 1 */}
              <div className="w-full border border-zinc-800 rounded bg-[#0a0a0c] p-4 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-mono tracking-widest text-zinc-600">DOMAIN 1</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 pl-3">
                    <Database className="w-5 h-5 text-zinc-400" />
                    <div>
                      <div className="text-xs font-bold tracking-widest">ASSET POLICY</div>
                      <div className="text-[10px] text-zinc-500">Asset authorization</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-500">● GRANTED</div>
                </div>
              </div>

              {/* HERO: The Decryption Gate */}
              <div className="w-full py-4 flex flex-col items-center relative">
                <div className="h-8 w-px bg-gradient-to-b from-emerald-500/50 to-red-500/50"></div>
                <div className="my-2 px-3 py-1 bg-red-950/30 border border-red-500/30 text-red-400 text-[10px] font-mono tracking-widest rounded-full">
                  AUTHORIZATION ≠ DECRYPTION
                </div>
                <div className="h-8 w-px bg-red-500/30"></div>
              </div>

              {/* DOMAIN 2 */}
              <div className="w-full border border-zinc-800 rounded bg-[#0a0a0c] p-4 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-mono tracking-widest text-zinc-600">DOMAIN 2</div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3 pl-3">
                    <Key className="w-5 h-5 text-zinc-400" />
                    <div>
                      <div className="text-xs font-bold tracking-widest">KEY POLICY</div>
                      <div className="text-[10px] text-zinc-500">Decryption authorization</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">● PENDING</div>
                </div>
              </div>

              <div className="w-px h-6 bg-zinc-800"></div>

              <div className="w-full flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/50 rounded opacity-50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-zinc-400" />
                  <div>
                    <div className="text-xs font-bold tracking-widest">KMS</div>
                    <div className="text-[10px] text-zinc-500">Key usage control</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">● PROTECTED</div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EVENTS & INCIDENTS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0a0a0c] border border-zinc-800 rounded-lg p-5 flex flex-col h-full max-h-[300px]">
            <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 mb-4 uppercase">Security Activity</h3>
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px]">
              {events.slice(0, activeEvent + 1).reverse().map((ev, i) => (
                <div key={i} className="pb-2 border-b border-zinc-800/50 last:border-0 animate-in fade-in slide-in-from-left-2">
                  <div className="flex justify-between text-zinc-500 mb-1">
                    <span>{ev.time}</span>
                    <span className="text-cyan-400">{ev.type}</span>
                  </div>
                  <div className="text-zinc-300">{ev.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0c] border border-zinc-800 rounded-lg p-5">
            <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 mb-4 uppercase">Active Incidents</h3>
            <div className="flex flex-col items-center justify-center py-6 text-zinc-600">
              <ShieldCheck className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[10px] tracking-widest font-mono">NO ACTIVE INCIDENTS</span>
            </div>
          </div>
        </div>
      </main>

      {/* Global Presentation Mode Overlay triggers from here or Admin */}
      <PresentationMode />
    </div>
  );
}
