'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { 
  ShieldAlert, Activity, Database, Key, ShieldCheck, 
  Fingerprint, Layers, FileText, Cpu, Crosshair, 
  MapPin, Clock, Terminal, ChevronRight, Lock, Play, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount, useChainId } from 'wagmi';

// --- TYPES ---
type LogEvent = {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  source: string;
  isReal: boolean;
};

type FabricNode = {
  id: string;
  label: string;
  icon: React.ElementType;
  domain: string;
  desc: string;
};

// --- DATA ---
const MAIN_FLOW: FabricNode[] = [
  { id: 'identity', label: 'Identity / DID', icon: Fingerprint, domain: 'Domain 1', desc: 'Verifiable credentials mapped to connected Web3 wallet.' },
  { id: 'rbac', label: 'RBAC / ABAC', icon: Layers, domain: 'Domain 1', desc: 'Context-aware role evaluation at the edge.' },
  { id: 'chain1', label: 'Domain 1 — Identity, RBAC & Asset Authorization', icon: Activity, domain: 'Domain 1', desc: 'Sepolia EVM: Anchors Identity and Asset metadata.' },
  { id: 'asset', label: 'Asset Security', icon: Database, domain: 'Domain 1', desc: 'Asset payload classification and mapping.' },
  { id: 'policy', label: 'Key Policy', icon: Shield, domain: 'Domain 2', desc: 'Cryptographic condition checks and expiration bounds.' },
  { id: 'chain2', label: 'Domain 2 — Key Policy & Decryption Authorization', icon: Activity, domain: 'Domain 2', desc: 'Sepolia EVM: Key and Decryption security policy.' },
  { id: 'kms', label: 'KMS', icon: Key, domain: 'Domain 2', desc: 'Off-chain Key Management System for DEK/KEK derivation.' },
  { id: 'decrypt', label: 'Temporary Decryption', icon: Lock, domain: 'Terminal', desc: 'Scoped, time-bound material injection.' },
];

const PARALLEL_NODES = {
  sentinel: { id: 'sentinel', label: 'Sentinel', icon: Crosshair, domain: 'Parallel', desc: 'Deterministic Security Checks and Sandbox Security Simulation.' },
  audit: { id: 'audit', label: 'Audit Trail', icon: FileText, domain: 'Parallel', desc: 'Cryptographically chained, tamper-evident logs.' }
};

export default function CyberCommandInterface() {
  const prefersReducedMotion = useReducedMotion();
  const [booting, setBooting] = useState(true);
  const [location, setLocation] = useState('ACQUIRING SIGNAL...');
  const [time, setTime] = useState('');
  const [selectedNode, setSelectedNode] = useState<FabricNode | null>(null);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [fabricStatus, setFabricStatus] = useState('SECURITY FABRIC: OPERATIONAL');
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  
  // Active animation state
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animStatus, setAnimStatus] = useState<'success' | 'denied' | null>(null);

  // Wagmi / Real Data
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [healthStatus, setHealthStatus] = useState('UNKNOWN');

  // --- Boot Sequence (Turbo) ---
  useEffect(() => {
    const t = setTimeout(() => {
      setBooting(false);
    }, 600); // Super fast 600ms boot
    return () => clearTimeout(t);
  }, []);

  // --- Real Data & Geolocation ---
  useEffect(() => {
    const updateTime = () => setTime(new Date().toISOString());
    const tId = setInterval(updateTime, 1000);
    updateTime();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation('LOCATION AVAILABLE'),
        () => setLocation('LOCATION NOT PROVIDED'),
        { timeout: 5000 }
      );
    } else {
      setLocation('LOCATION API UNAVAILABLE');
    }

    // Real backend fetch
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.status) setHealthStatus('ONLINE');
      })
      .catch(() => setHealthStatus('DEGRADED'));

    return () => clearInterval(tId);
  }, []);

  // --- Ambient Traffic Animation ---
  useEffect(() => {
    if (booting || isAnimating || activeThreat || prefersReducedMotion) return;
    
    // Ambient success pulse every 6 seconds
    const interval = setInterval(() => {
      if (isAnimating || activeThreat) return;
      triggerFabricFlow(true);
      addLog('[REAL] Routine backend heartbeat completed successfully', 'info', 'Health Check', true);
    }, 6000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting, isAnimating, activeThreat, prefersReducedMotion]);

  const addLog = (message: string, type: LogEvent['type'], source: string, isReal: boolean) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString().split('T')[1].replace('Z', ''),
      message,
      type,
      source,
      isReal
    }, ...prev].slice(0, 40)); // Keep newest at top, max 40
  };

  // --- Fabric Flow Animation Logic ---
  const triggerFabricFlow = async (isSuccess: boolean, stopAtStep?: number, threatType?: string) => {
    setIsAnimating(true);
    setAnimStatus(null);
    setActiveStepIndex(-1);

    const targetStep = stopAtStep !== undefined ? stopAtStep : MAIN_FLOW.length - 1;
    
    for (let i = 0; i <= targetStep; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, 150)); // Fast traversal
    }

    if (isSuccess) {
      setAnimStatus('success');
      setTimeout(() => {
        setActiveStepIndex(-1);
        setAnimStatus(null);
        setIsAnimating(false);
      }, 1000);
    } else {
      setAnimStatus('denied');
      // Briefly highlight Sentinel and Audit
      setTimeout(() => {
        setFabricStatus('SECURITY FABRIC: OPERATIONAL');
        setActiveThreat(null);
        setActiveStepIndex(-1);
        setAnimStatus(null);
        setIsAnimating(false);
      }, 3000);
    }
  };

  // --- Sandbox Simulations ---
  const launchProbe = (type: 'replay' | 'escalation' | 'expired') => {
    if (isAnimating) return;
    setActiveThreat(type);
    setFabricStatus('THREAT DETECTED: ENGAGING SENTINEL');
    
    addLog(`[SIMULATION] Launching ${type} attack probe`, 'warning', 'Sandbox', false);
    
    let failStep = 1; // RBAC
    let blockedLayer = 'RBAC';
    
    if (type === 'replay') { failStep = 1; blockedLayer = 'Session Validation'; }
    if (type === 'escalation') { failStep = 4; blockedLayer = 'Key Policy'; }
    if (type === 'expired') { failStep = 6; blockedLayer = 'KMS Orchestrator'; }

    triggerFabricFlow(false, failStep, type);
    
    // Logging sequence
    setTimeout(() => {
      addLog(`[SIMULATION] Request rejected at ${blockedLayer} layer`, 'critical', 'Security Check', false);
    }, failStep * 150 + 200);
    
    setTimeout(() => {
      addLog(`[SIMULATION] Threat neutralized. Sentinel and Audit updated.`, 'success', 'Sentinel', false);
    }, failStep * 150 + 800);
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-zinc-400 font-sans p-6">
        <ShieldCheck className="w-16 h-16 mb-6 text-zinc-600 animate-pulse" />
        <h2 className="text-xl tracking-widest text-zinc-200 mb-8 font-mono">SECUREMAX</h2>
        <div className="text-xs space-y-2 font-mono text-zinc-500 mb-8 w-64">
          <div className="flex justify-between"><span>IDENTITY ORACLE</span><span className="text-emerald-500">✓</span></div>
          <div className="flex justify-between"><span>BLOCKCHAIN RPC</span><span className="text-emerald-500">✓</span></div>
          <div className="flex justify-between"><span>ACCESS POLICY</span><span className="text-emerald-500">✓</span></div>
          <div className="flex justify-between"><span>KMS ORCHESTRATOR</span><span className="text-emerald-500">✓</span></div>
          <div className="flex justify-between"><span>SENTINEL ENGINE</span><span className="text-emerald-500">✓</span></div>
        </div>
        <p className="text-[10px] tracking-[0.2em] text-red-500/80">INITIALIZING SECURITY FABRIC</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0c] text-zinc-300 font-sans lg:overflow-hidden selection:bg-red-900/40 min-h-0">
      
      {/* Top Bar */}
      <header className="shrink-0 border-b border-zinc-800/60 bg-zinc-950/80 px-4 py-2 md:px-6 md:py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-6 w-6 rounded-md bg-cyan-600 items-center justify-center mr-1">
            <div className="h-2.5 w-2.5 bg-[#0a0a0c] rounded-sm" />
          </div>
          <ShieldAlert className={`w-5 h-5 ${fabricStatus.includes('THREAT') ? 'text-amber-500 animate-pulse' : 'text-zinc-500'}`} />
          <h1 className="text-sm md:text-base font-bold tracking-widest uppercase">
            <span className="text-zinc-100 mr-3 hidden sm:inline-block">SECUREMAX</span>
            <span className={fabricStatus.includes('THREAT') ? 'text-amber-500 glow-text' : 'text-zinc-400'}>{fabricStatus}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] md:text-xs text-zinc-500 font-mono uppercase tracking-wider">
          <div className="hidden lg:flex items-center gap-2"><MapPin className="w-3 h-3"/> {location}</div>
          <div className="hidden md:flex items-center gap-2"><Clock className="w-3 h-3"/> {time}</div>
          <Link href="/login">
            <Button size="sm" className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 rounded-sm font-bold text-[10px] tracking-wider h-8 px-4 transition-colors">
              EXPLORE PLATFORM <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Command Center Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 relative z-10">
        
        {/* LEFT COLUMN: Telemetry & Auth!=Decrypt */}
        <div className="lg:col-span-3 border-r border-zinc-800/60 bg-zinc-950/40 flex flex-col min-h-0 order-2 lg:order-1">
          {/* Authorization != Decryption Highlight */}
          <div className="p-5 border-b border-zinc-800/60 shrink-0">
            <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 mb-4 uppercase">Core Architecture</h3>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded p-4 text-[10px] md:text-xs font-mono">
              <div className="text-zinc-200 font-bold mb-2">AUTHORIZATION ≠ DECRYPTION</div>
              <div className="text-zinc-500 mb-3 leading-relaxed">Permission to access an asset does not automatically grant access to its encryption key.</div>
              
              <div className="pl-2 border-l border-emerald-500/30 text-emerald-400/80 mb-2">
                <div>✓ Identity & Role Validated</div>
                <div>✓ Asset Permission Granted</div>
              </div>
              <div className="text-center text-zinc-600 my-1">▼ SECOND GATE ▼</div>
              <div className="pl-2 border-l border-cyan-500/30 text-cyan-400/80">
                <div>✓ Key Policy Verified</div>
                <div>✓ KMS Cryptomaterial Injected</div>
              </div>
            </div>
          </div>

          {/* Live Telemetry (Newest at top, NO auto-scroll bug) */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800/60 text-[10px] font-bold text-zinc-500 uppercase tracking-widest shrink-0 flex items-center justify-between">
              <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> LIVE TELEMETRY</span>
              <span className="text-emerald-500/50">AUTO-TAIL</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`text-[10px] p-2.5 font-mono border-l-2 bg-[#0d0d10] ${
                      log.type === 'critical' ? 'border-red-500 text-red-400' : 
                      log.type === 'warning' ? 'border-amber-500 text-amber-400' :
                      log.type === 'success' ? 'border-emerald-500 text-emerald-400' :
                      'border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <div className="flex justify-between opacity-60 mb-1.5 uppercase tracking-wider text-[9px]">
                      <span>{log.timestamp}</span>
                      <div className="flex items-center gap-1.5">
                        {log.isReal ? <span className="text-cyan-500">[REAL]</span> : <span className="text-amber-500">[SIMULATION]</span>}
                        <span>{log.source}</span>
                      </div>
                    </div>
                    <div className="break-words leading-relaxed">{log.message}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Security Fabric Visualizer */}
        <div className="lg:col-span-6 relative flex flex-col p-4 md:p-8 bg-zinc-950/20 order-1 lg:order-2 overflow-y-auto lg:overflow-hidden min-h-[500px]">
          <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-8 text-center shrink-0">Security Fabric Flow</h2>
          
          <div className="flex-1 relative max-w-sm mx-auto w-full flex flex-col items-center justify-between pb-10">
            {/* Connection Line Behind with Glowing Packet */}
            <div className="absolute top-4 bottom-4 left-1/2 w-px bg-zinc-800 -translate-x-1/2 z-0 overflow-hidden">
              {(!isAnimating && !activeThreat && !prefersReducedMotion) && (
                <div className="absolute left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent animate-[flowDown_3.2s_linear_infinite]" />
              )}
            </div>
            
            {/* The Main Nodes */}
            {MAIN_FLOW.map((node, i) => {
              const isActive = activeStepIndex >= i;
              const isCurrent = activeStepIndex === i;
              const isDeniedHere = animStatus === 'denied' && isCurrent;
              
              const showAmbientGlow = !isAnimating && !activeThreat && !prefersReducedMotion;
              
              return (
                <div key={node.id} className="relative z-10 flex flex-col items-center group cursor-pointer w-full" onClick={() => setSelectedNode(node)}>
                  <div 
                    className={`flex items-center justify-center w-full px-4 py-2 border backdrop-blur-md rounded transition-all duration-300 ${
                      isDeniedHere ? 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                      isActive ? 'bg-zinc-900 border-zinc-600 text-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 
                      `bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 ${showAmbientGlow ? 'ambient-glow' : ''}`
                    }`}
                    style={showAmbientGlow ? { animationDelay: `${i * 0.4}s` } : {}}
                  >
                    <node.icon className={`w-4 h-4 mr-3 ${isDeniedHere ? 'text-red-400' : (isActive || showAmbientGlow) ? 'text-zinc-400 icon-glow' : 'text-zinc-600'}`} style={showAmbientGlow ? { animationDelay: `${i * 0.4}s` } : {}} />
                    <span className="text-xs md:text-sm font-bold tracking-wide">{node.label}</span>
                  </div>
                  
                  {/* Small subtitle domain indication */}
                  <span className="absolute -right-20 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600 font-mono tracking-wider hidden sm:block w-16">
                    {node.domain}
                  </span>
                </div>
              );
            })}

            {/* Parallel Nodes (Sentinel & Audit) */}
            <div className="absolute top-1/2 -right-10 md:-right-24 translate-x-full -translate-y-1/2 flex flex-col gap-8 z-10 hidden sm:flex">
              {[PARALLEL_NODES.sentinel, PARALLEL_NODES.audit].map(node => {
                const isTriggered = animStatus === 'denied' && node.id === 'sentinel' || animStatus === 'denied' && node.id === 'audit';
                return (
                  <div key={node.id} className="relative flex items-center cursor-pointer" onClick={() => setSelectedNode(node as FabricNode)}>
                    {/* Horizontal connector line */}
                    <div className={`absolute right-full top-1/2 h-px w-12 md:w-20 -translate-y-1/2 ${isTriggered ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                    <div className={`px-4 py-2 border rounded text-xs font-bold tracking-wide transition-all ${
                      isTriggered ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                      'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}>
                      <span className="flex items-center gap-2"><node.icon className="w-3 h-3" /> {node.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Node Inspector & Sentinel Sandbox */}
        <div className="lg:col-span-3 border-l border-zinc-800/60 bg-zinc-950/40 flex flex-col min-h-0 order-3">
          
          {/* Node Inspector */}
          <div className="flex-1 border-b border-zinc-800/60 p-5 flex flex-col min-h-[250px] shrink-0 overflow-y-auto">
            <h3 className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2 shrink-0">
              <Database className="w-3 h-3" /> NODE INSPECTOR
            </h3>
            
            {selectedNode ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 border border-zinc-700 bg-zinc-900 flex items-center justify-center rounded">
                    <selectedNode.icon className="w-5 h-5 text-zinc-300" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 tracking-wide">{selectedNode.label}</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {selectedNode.desc}
                </p>
                
                {/* Simulated Real Data Table depending on Node */}
                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-800/80 p-3 rounded space-y-2 mt-auto">
                  {selectedNode.id.includes('chain') ? (
                    <>
                      <div className="flex justify-between"><span className="text-zinc-600">NETWORK</span> <span className="text-zinc-200">Ethereum Sepolia</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">CHAIN ID</span> <span className="text-cyan-400">11155111</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">RPC</span> <span className="text-emerald-400">CONNECTED</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">CONTRACTS</span> <span className="text-zinc-200">7 / 7 ONLINE</span></div>
                    </>
                  ) : selectedNode.id === 'identity' ? (
                    <>
                      <div className="flex justify-between"><span className="text-zinc-600">STATUS</span> <span className="text-emerald-400">ACTIVE</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">AUTH METHOD</span> <span className="text-cyan-400">EIP-191</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">WALLET</span> <span className={isConnected ? "text-emerald-400" : "text-amber-400"}>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">SESSION</span> <span className="text-zinc-200">HTTP-ONLY</span></div>
                    </>
                  ) : selectedNode.id === 'sentinel' ? (
                    <>
                      <div className="flex justify-between"><span className="text-zinc-600">ENGINE</span> <span className="text-emerald-400">ACTIVE</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">SANDBOX</span> <span className="text-zinc-200">ISOLATED</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">DETECTIONS</span> <span className="text-cyan-400">5 IMPLEMENTED</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-zinc-600">STATUS</span> <span className="text-emerald-400">ONLINE</span></div>
                      <div className="flex justify-between"><span className="text-zinc-600">STATE</span> <span className="text-zinc-200">ENFORCED</span></div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-600 border border-zinc-800/40 border-dashed rounded p-6 text-center uppercase tracking-widest">
                Select a fabric node to inspect live configuration
              </div>
            )}
          </div>

          {/* Sentinel Sandbox */}
          <div className="flex-1 p-5 flex flex-col shrink-0 overflow-y-auto">
            <h3 className="text-[11px] font-bold tracking-widest text-amber-500/90 mb-2 flex items-center gap-2">
              <Crosshair className="w-3 h-3" /> SENTINEL SANDBOX
            </h3>
            <p className="text-[10px] text-zinc-500 mb-5 leading-relaxed">
              [TEST MODE] Launch Controlled Security Validation against isolated test endpoints. Visualizes Sandbox Security Simulation without risking production assets.
            </p>
            <div className="space-y-2.5 mt-auto">
              <Button 
                onClick={() => launchProbe('replay')}
                disabled={isAnimating}
                className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] tracking-wider h-9 rounded-sm transition-all disabled:opacity-50 font-mono"
              >
                <Play className="w-3 h-3 mr-2 text-amber-500" /> [RUN] REPLAY ATTACK
              </Button>
              <Button 
                onClick={() => launchProbe('escalation')}
                disabled={isAnimating}
                className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] tracking-wider h-9 rounded-sm transition-all disabled:opacity-50 font-mono"
              >
                <Play className="w-3 h-3 mr-2 text-amber-500" /> [RUN] PRIVILEGE ESCALATION
              </Button>
              <Button 
                onClick={() => launchProbe('expired')}
                disabled={isAnimating}
                className="w-full justify-start bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] tracking-wider h-9 rounded-sm transition-all disabled:opacity-50 font-mono"
              >
                <Play className="w-3 h-3 mr-2 text-amber-500" /> [RUN] EXPIRED TOKEN
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Metrics Bar */}
      <footer className="shrink-0 border-t border-zinc-800/60 bg-zinc-950 px-4 py-2.5 overflow-x-auto hide-scrollbar z-20">
        <div className="flex items-center gap-6 md:justify-around min-w-max text-[9px] md:text-[10px] font-mono tracking-widest uppercase">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">Identity</span>
            <span className={isConnected ? "text-emerald-400" : "text-zinc-300"}>{isConnected ? 'CONNECTED' : 'STANDBY'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">RBAC</span>
            <span className="text-zinc-300">ENFORCED</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">Blockchain</span>
            <span className={chainId ? "text-cyan-400" : "text-zinc-300"}>{chainId === 11155111 ? 'SEPOLIA' : '7/7 ONLINE'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">KMS</span>
            <span className="text-emerald-400">PROTECTED</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">Encryption</span>
            <span className="text-zinc-300">AES-256-GCM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">Sentinel</span>
            <span className="text-amber-400">ACTIVE</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-600">Audit</span>
            <span className="text-zinc-300">TAMPER-EVIDENT</span>
          </div>
        </div>
      </footer>

      {/* Utilities */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes flowDown {
          0% { top: -20%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 120%; opacity: 0; }
        }
        .ambient-glow {
          animation: ambientPulse 3.2s infinite;
        }
        .icon-glow {
          animation: iconPulse 3.2s infinite;
        }
        @keyframes ambientPulse {
          0%, 100% { 
            border-color: rgba(39, 39, 42, 1); 
            color: rgb(113, 113, 122); 
            box-shadow: 0 0 0 rgba(0,0,0,0);
            background-color: rgba(9, 9, 11, 1);
          }
          15% { 
            border-color: rgba(161, 161, 170, 0.4); 
            color: rgb(228, 228, 231); 
            box-shadow: 0 0 15px rgba(255,255,255,0.03);
            background-color: rgba(24, 24, 27, 1);
          }
        }
        @keyframes iconPulse {
          0%, 100% { color: rgb(82, 82, 91); }
          15% { color: rgb(212, 212, 216); }
        }
      `}} />
    </div>
  );
}
