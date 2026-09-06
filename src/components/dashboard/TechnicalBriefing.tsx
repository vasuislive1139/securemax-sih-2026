'use client';
import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Layers, Database, Key, Lock, Activity, FileText, ChevronRight, X, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  'THE PROBLEM',
  'THE SECUREMAX APPROACH',
  'IDENTITY',
  'DOMAIN 1',
  'DOMAIN 2',
  'KMS',
  'PROTECTED DATA',
  'SENTINEL',
  'AUDIT',
  'END-TO-END FLOW'
];

export function TechnicalBriefing({ onClose }: { onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-[100] flex bg-zinc-950 font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-zinc-800 bg-[#0a0a0c] flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <Hexagon className="w-5 h-5 text-cyan-400" />
          <span className="font-bold tracking-widest text-zinc-100">SECURE<span className="text-cyan-400">MAX</span></span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[10px] font-mono tracking-widest text-zinc-600 mb-4 px-4 uppercase">Architecture Briefing</div>
          {SECTIONS.map((sec, i) => (
            <button 
              key={sec}
              onClick={() => setActiveIdx(i)}
              className={`w-full text-left px-4 py-3 rounded text-xs font-mono tracking-widest uppercase transition-colors ${i === activeIdx ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-transparent to-transparent">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-900 transition-colors z-10 border border-transparent hover:border-zinc-800 text-zinc-500 hover:text-zinc-300">
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl"
            >
              <h2 className="text-3xl font-bold tracking-widest uppercase text-zinc-100 mb-8 pb-4 border-b border-zinc-800">
                {SECTIONS[activeIdx]}
              </h2>

              {activeIdx === 0 && (
                <div className="space-y-6 text-zinc-400 leading-relaxed font-mono text-sm max-w-2xl">
                  <p>In traditional architecture, an authenticated user who is granted access to a resource is simultaneously handed the decryption keys. <strong className="text-red-400">If authorization is bypassed, data is compromised.</strong></p>
                  <p>SecureMax was designed to decouple authorization from cryptography.</p>
                </div>
              )}

              {activeIdx === 1 && (
                <div className="bg-[#0a0a0c] border border-zinc-800 rounded-lg p-10 flex flex-col items-center text-center">
                   <h3 className="text-2xl font-bold text-emerald-500 mb-6 tracking-[0.2em]">AUTHORIZATION ≠ DECRYPTION</h3>
                   <p className="text-sm font-mono text-zinc-400 max-w-lg leading-relaxed">
                     Asset permissions (Domain 1) and Cryptographic Key policies (Domain 2) are separated into logically distinct enforcement boundaries on the Ethereum Sepolia network.
                   </p>
                </div>
              )}

              {activeIdx === 9 && (
                <div className="bg-[#0a0a0c] border border-zinc-800 p-8 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-zinc-900/5 stripe-pattern" />
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    
                    {/* The Architecture Flow */}
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                      <div className="flex items-center gap-4 w-full p-3 bg-black/50 border border-zinc-800 rounded"><Fingerprint className="w-5 h-5 text-zinc-500"/><span className="font-mono text-xs text-zinc-300">IDENTITY</span></div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 rotate-90" />
                      <div className="flex items-center gap-4 w-full p-3 bg-black/50 border border-zinc-800 rounded"><Layers className="w-5 h-5 text-zinc-500"/><span className="font-mono text-xs text-zinc-300">RBAC + CONTEXT</span></div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 rotate-90" />
                      <div className="flex items-center gap-4 w-full p-3 bg-black/50 border border-zinc-800 rounded"><Database className="w-5 h-5 text-zinc-500"/><span className="font-mono text-xs text-zinc-300">DOMAIN 1: ASSET AUTHORIZATION</span></div>
                      
                      {/* Security Gate */}
                      <div className="h-6 w-px bg-gradient-to-b from-emerald-500/50 to-red-500/50" />
                      
                      <div className="flex items-center gap-4 w-full p-3 bg-black/50 border border-zinc-800 rounded"><Key className="w-5 h-5 text-zinc-500"/><span className="font-mono text-xs text-zinc-300">DOMAIN 2: KEY AUTHORIZATION</span></div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 rotate-90" />
                      <div className="flex items-center gap-4 w-full p-3 bg-black/50 border border-zinc-800 rounded"><Lock className="w-5 h-5 text-zinc-500"/><span className="font-mono text-xs text-zinc-300">KMS DECRYPTION</span></div>
                    </div>

                    {/* Sentinel & Audit Wrap */}
                    <div className="flex gap-4 w-full max-w-md mt-6 pt-6 border-t border-zinc-800">
                      <div className="flex-1 flex flex-col items-center p-3 border border-zinc-800 rounded bg-cyan-500/5 text-cyan-400">
                        <Activity className="w-5 h-5 mb-2" />
                        <span className="font-mono text-[10px] tracking-widest">SENTINEL</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center p-3 border border-zinc-800 rounded bg-emerald-500/5 text-emerald-500">
                        <FileText className="w-5 h-5 mb-2" />
                        <span className="font-mono text-[10px] tracking-widest">AUDIT</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeIdx > 1 && activeIdx < 9 && (
                <div className="bg-[#0a0a0c] border border-zinc-800 rounded-lg p-10 min-h-[300px] flex items-center justify-center">
                  <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                    {SECTIONS[activeIdx]} documentation loaded.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-zinc-800 p-6 flex justify-between bg-[#0a0a0c]">
          <button 
            disabled={activeIdx === 0}
            onClick={() => setActiveIdx(p => p - 1)}
            className="text-xs font-mono tracking-widest text-zinc-500 hover:text-zinc-100 disabled:opacity-30 uppercase"
          >
            Previous
          </button>
          <button 
            disabled={activeIdx === SECTIONS.length - 1}
            onClick={() => setActiveIdx(p => p + 1)}
            className="text-xs font-mono tracking-widest text-cyan-400 hover:text-cyan-300 disabled:opacity-30 uppercase"
          >
            Next Section
          </button>
        </div>
      </div>
    </div>
  );
}
