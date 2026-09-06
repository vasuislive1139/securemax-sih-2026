'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Server, Lock, Activity, Database, CheckCircle2, XCircle, Play, Pause, ChevronRight, ChevronLeft, X, ShieldAlert, Cpu, Eye, FileText, Code2, Layers, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SECTIONS = [
  { id: 'overview', title: '1. Architecture Overview' },
  { id: 'request-flow', title: '2. How a Request Works' },
  { id: 'auth', title: '3. Identity & Authentication' },
  { id: 'rbac', title: '4. RBAC & Authorization' },
  { id: 'domain1', title: '5. Domain 1: Identity & Asset' },
  { id: 'domain2', title: '6. Domain 2: Key & Decryption' },
  { id: 'kms', title: '7. Encryption & KMS' },
  { id: 'cross-domain', title: '8. Cross-Domain Auth' },
  { id: 'sentinel', title: '9. Sentinel Engine' },
  { id: 'testing', title: '10. Security Test Lab' },
  { id: 'attack-path', title: '11. Attack Path Flow' },
  { id: 'fail-closed', title: '12. Fail-Closed Security' },
  { id: 'temporary', title: '13. Temporary Access' },
  { id: 'audit', title: '14. Audit & Forensics' },
  { id: 'incident', title: '15. Incident Response' },
  { id: 'smart-contracts', title: '16. Smart Contract Layer' },
  { id: 'preflight', title: '17. Transaction Pre-flight' },
  { id: 'stack', title: '18. Technology Stack' },
  { id: 'roadmap', title: '19. Implemented vs Roadmap' },
  { id: 'why', title: '20. Why SecureMax?' },
];

const BRIEFING_FLOW = [
  'overview', 'auth', 'rbac', 'domain1', 'domain2', 'kms', 'cross-domain', 'sentinel', 'incident', 'audit', 'why'
];

export function TechnicalBriefing({ onClose }: { onClose: () => void }) {
  const [activeId, setActiveId] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (playIndex < BRIEFING_FLOW.length - 1) {
          setPlayIndex(prev => prev + 1);
          setActiveId(BRIEFING_FLOW[playIndex + 1]);
        } else {
          setIsPlaying(false);
        }
      }, 7000); // 7 seconds per slide
    }
    return () => clearTimeout(timer);
  }, [isPlaying, playIndex]);

  const handlePlay = () => {
    if (!isPlaying) {
      const idx = BRIEFING_FLOW.indexOf(activeId);
      if (idx !== -1) setPlayIndex(idx);
      else { setPlayIndex(0); setActiveId(BRIEFING_FLOW[0]); }
    }
    setIsPlaying(!isPlaying);
  };

  const nextSlide = () => {
    const idx = SECTIONS.findIndex(s => s.id === activeId);
    if (idx < SECTIONS.length - 1) setActiveId(SECTIONS[idx + 1].id);
  };

  const prevSlide = () => {
    const idx = SECTIONS.findIndex(s => s.id === activeId);
    if (idx > 0) setActiveId(SECTIONS[idx - 1].id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-zinc-300 font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-white/10 bg-black/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-white tracking-widest font-mono">HOW SECUREMAX WORKS</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider">Security architecture, authorization flow, cryptographic controls and enforcement logic.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant={isPlaying ? "destructive" : "default"} size="sm" onClick={handlePlay} className={isPlaying ? 'animate-pulse font-mono' : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 font-mono'}>
            {isPlaying ? <><Pause className="w-4 h-4 mr-2" /> PAUSE BRIEFING</> : <><Play className="w-4 h-4 mr-2" /> TECHNICAL BRIEFING MODE</>}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-black/20 overflow-y-auto hidden md:block shrink-0">
          <div className="p-4 space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => { setActiveId(section.id); setIsPlaying(false); }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-colors ${
                  activeId === section.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto h-full"
            >
              <ContentRouter id={activeId} setActiveId={setActiveId} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Controls */}
      <div className="h-14 border-t border-white/10 bg-black/50 flex items-center justify-between px-6 shrink-0">
        <Button variant="ghost" size="sm" onClick={prevSlide} disabled={SECTIONS.findIndex(s=>s.id===activeId)===0} className="font-mono text-xs">
          <ChevronLeft className="w-4 h-4 mr-2" /> PREVIOUS
        </Button>
        <div className="flex gap-2">
           {SECTIONS.map((s, i) => (
             <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${s.id === activeId ? 'bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'bg-white/20'}`} />
           ))}
        </div>
        <Button variant="ghost" size="sm" onClick={nextSlide} disabled={SECTIONS.findIndex(s=>s.id===activeId)===SECTIONS.length-1} className="font-mono text-xs">
          NEXT <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ContentRouter({ id, setActiveId }: { id: string, setActiveId: (id: string) => void }) {
  switch (id) {
    case 'overview': return <OverviewSection onNavigate={setActiveId} />;
    case 'request-flow': return <RequestFlowSection />;
    case 'auth': return <AuthSection />;
    case 'rbac': return <RBACSection />;
    case 'domain1': return <Domain1Section />;
    case 'domain2': return <Domain2Section />;
    case 'kms': return <KMSSection />;
    case 'cross-domain': return <CrossDomainSection />;
    case 'sentinel': return <SentinelSection />;
    case 'testing': return <TestingSection />;
    case 'attack-path': return <AttackPathSection />;
    case 'fail-closed': return <FailClosedSection />;
    case 'temporary': return <TemporaryAccessSection />;
    case 'audit': return <AuditSection />;
    case 'incident': return <IncidentSection />;
    case 'smart-contracts': return <ContractsSection />;
    case 'preflight': return <PreflightSection />;
    case 'stack': return <StackSection />;
    case 'roadmap': return <RoadmapSection />;
    case 'why': return <WhySection />;
    default: return <div>Section not found</div>;
  }
}

// ---------------------------------------------------------
// SECTION COMPONENTS
// ---------------------------------------------------------

const OverviewSection = ({ onNavigate }: { onNavigate?: (id: string) => void }) => (
  <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-3xl font-mono text-primary font-bold tracking-widest text-center">SECUREMAX ARCHITECTURE</h2>
    <div className="w-full max-w-3xl relative border border-white/10 rounded-xl p-8 bg-black/40 backdrop-blur">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat rounded-xl pointer-events-none"></div>
      
      <div className="flex flex-col items-center gap-4 relative z-10">
        <Node label="IDENTITY" type="auth" onClick={() => onNavigate?.('auth')} />
        <Arrow />
        <Node label="SESSION" type="auth" onClick={() => onNavigate?.('auth')} />
        <Arrow />
        <Node label="RBAC" type="auth" onClick={() => onNavigate?.('rbac')} />
        <Arrow />
        
        <div className="grid grid-cols-2 gap-8 w-full">
           <div className="flex flex-col items-center border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-lg">
             <h3 className="text-xs font-mono text-emerald-400 mb-2">DOMAIN 1</h3>
             <Node label="Asset Authorization" type="success" onClick={() => onNavigate?.('domain1')} />
           </div>
           <div className="flex flex-col items-center border border-amber-500/30 bg-amber-500/5 p-4 rounded-lg">
             <h3 className="text-xs font-mono text-amber-500 mb-2">DOMAIN 2</h3>
             <Node label="Key Authorization" type="warning" onClick={() => onNavigate?.('domain2')} />
           </div>
        </div>
        
        <Arrow />
        <Node label="KMS" type="secure" onClick={() => onNavigate?.('kms')} />
        <Arrow />
        <Node label="DECRYPTION" type="secure" onClick={() => onNavigate?.('temporary')} />
      </div>
      
      <div className="absolute top-1/4 -left-12 flex flex-col gap-2">
         <Badge variant="outline" className="border-cyan-500 text-cyan-400 bg-cyan-500/10 px-3 py-1 font-mono">SENTINEL (Monitoring)</Badge>
      </div>
      <div className="absolute top-3/4 -right-8 flex flex-col gap-2">
         <Badge variant="outline" className="border-cyan-500 text-cyan-400 bg-cyan-500/10 px-3 py-1 font-mono">AUDIT (Verification)</Badge>
      </div>
    </div>
    
    <div className="text-center mt-8">
      <h1 className="text-4xl font-bold font-mono text-red-500 glow-text mb-2">AUTHORIZATION ≠ DECRYPTION</h1>
      <p className="text-zinc-400 font-mono text-sm tracking-widest">THE CORE SECURITY PRINCIPLE</p>
    </div>
  </div>
);

const RequestFlowSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">HOW A REQUEST WORKS</h2>
    <div className="grid gap-4 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
      {[
        { step: '01', title: 'CRYPTOGRAPHIC IDENTITY', desc: 'The user authenticates using a registered wallet through a challenge-response signature.', why: 'Verifies control of the wallet without exposing a password.', comp: 'EIP-191 & Next.js API', fail: 'Authentication is rejected and no authenticated session is established.' },
        { step: '02', title: 'SESSION ESTABLISHMENT', desc: 'A secure HttpOnly JWT session is created and tracked.', why: 'Provides stateless, tamper-proof session persistence.', comp: 'Edge Middleware (jose)', fail: 'Request is intercepted and redirected to login.' },
        { step: '03', title: 'RBAC EVALUATION', desc: 'The session role is mapped against endpoint requirements.', why: 'Ensures only admins can perform admin actions.', comp: 'RBACManager', fail: 'ACCESS DENIED: Insufficient privileges.' },
        { step: '04', title: 'ASSET AUTHORIZATION', desc: 'Checks Domain 1 to see if the user is authorized for the specific asset.', why: 'Data is compartmentalized by ownership and assignment.', comp: 'AssetRegistry (Sepolia)', fail: 'ACCESS DENIED: Asset unauthorized.' },
        { step: '05', title: 'KEY AUTHORIZATION', desc: 'Checks Domain 2 to see if the key is active and assigned to the user.', why: 'Separates data ownership from cryptographic capability.', comp: 'KeyPolicyManager (Sepolia)', fail: 'ACCESS DENIED: Key policy revoked or inactive.' },
        { step: '06', title: 'KMS ENFORCEMENT', desc: 'KMS validates the dual-domain approval before unwrapping the secret.', why: 'Prevents raw key material from leaking unless strictly authorized.', comp: 'KMS Abstraction', fail: 'DECRYPTION DENIED: KMS Lock.' },
        { step: '07', title: 'TEMPORARY DECRYPTION CAPABILITY', desc: 'A short-lived capability token is issued to the client.', why: 'Limits the window of vulnerability if a session is compromised.', comp: 'Access Flow API', fail: 'Capability issuance fails.' },
        { step: '08', title: 'DATA DECRYPTION', desc: 'AES-256-GCM decrypts the cipher using the temporary key.', why: 'Transforms encrypted storage back to usable plaintext.', comp: 'Client Decryption Engine', fail: 'DECRYPTION DENIED: Integrity check fails.' },
        { step: '09', title: 'AUDIT', desc: 'The transaction hash and metadata are anchored.', why: 'Creates a tamper-evident chronological log.', comp: 'AuditAnchor (Sepolia)', fail: 'Alert generated for audit failure.' }
      ].map(s => (
        <Card key={s.step} className="bg-black/40 border-white/10">
          <CardContent className="p-4 flex gap-4">
            <div className="text-3xl font-mono text-zinc-700 font-bold">{s.step}</div>
            <div className="space-y-2 flex-1">
              <h3 className="font-mono text-primary font-bold">{s.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div><span className="text-zinc-500">What happens:</span> <span className="text-zinc-300">{s.desc}</span></div>
                <div><span className="text-zinc-500">Why:</span> <span className="text-emerald-400/80">{s.why}</span></div>
                <div><span className="text-zinc-500">Component:</span> <span className="text-cyan-400/80">{s.comp}</span></div>
                <div><span className="text-zinc-500">Failure:</span> <span className="text-red-400/80">{s.fail}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const AuthSection = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center border-b border-white/10 pb-4">
      <h2 className="text-2xl font-mono text-primary">IDENTITY & AUTHENTICATION</h2>
      <Badge variant="outline" className="border-emerald-500 text-emerald-500 font-mono tracking-widest">IMPLEMENTED</Badge>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
         <h3 className="font-mono text-zinc-400 mb-4">Cryptographic Flow:</h3>
         <FlowBlock label="Wallet" />
         <FlowBlock label="Challenge / Nonce" />
         <FlowBlock label="EIP-191 Signature" />
         <FlowBlock label="Signature Verification" />
         <FlowBlock label="Registered Wallet Lookup" />
         <FlowBlock label="Role Resolution" />
         <FlowBlock label="Secure HttpOnly Session" />
      </div>
      <div className="space-y-6">
         <Card className="bg-black/40 border-white/10">
           <CardHeader><CardTitle className="text-sm font-mono text-primary">Technical Details</CardTitle></CardHeader>
           <CardContent className="space-y-4 text-xs font-mono text-zinc-400">
             <p><strong className="text-white">Challenge Nonce:</strong> Cryptographically secure random hex generated per attempt to prevent replay attacks.</p>
             <p><strong className="text-white">Address Binding:</strong> The challenge explicitly includes the attempting wallet address.</p>
             <p><strong className="text-white">Signature Verification:</strong> Off-chain recovering of the signer address via viem verifyMessage.</p>
             <p><strong className="text-white">Single-use Challenge:</strong> Challenge cookie is deleted immediately upon use.</p>
             <p><strong className="text-white">Expiration:</strong> Time-bound tokens.</p>
             <p><strong className="text-white">Session Cookie:</strong> Secure, HttpOnly, SameSite=Lax JWT used for edge routing.</p>
           </CardContent>
         </Card>
         <div className="p-4 border-l-2 border-amber-500 bg-amber-500/10 text-xs font-mono text-amber-200">
           Strict adherence: Private keys, environment variables, API keys, and KMS master keys are NEVER exposed to the client browser.
         </div>
      </div>
    </div>
  </div>
);

const RBACSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">RBAC & AUTHORIZATION</h2>
    <div className="flex gap-8">
      <div className="w-1/3 space-y-3">
        <h3 className="font-mono text-zinc-400 mb-4">Supported Roles:</h3>
        {['ADMIN', 'MANAGER', 'AUDITOR', 'USER'].map(r => (
          <div key={r} className="p-3 border border-white/10 bg-black/40 rounded font-mono text-center text-sm">{r}</div>
        ))}
      </div>
      <div className="w-2/3 space-y-6">
        <Card className="bg-black/40 border-white/10">
           <CardContent className="p-6">
             <div className="flex justify-between items-center font-mono text-xs">
               <span className="text-zinc-400">Identity</span>
               <ChevronRight className="w-4 h-4 text-primary" />
               <span className="text-cyan-400">Role</span>
               <ChevronRight className="w-4 h-4 text-primary" />
               <span className="text-emerald-400">Permission</span>
               <ChevronRight className="w-4 h-4 text-primary" />
               <span className="text-amber-400">Resource</span>
               <ChevronRight className="w-4 h-4 text-primary" />
               <span className="text-white font-bold bg-primary/20 px-2 py-1 rounded">Decision</span>
             </div>
           </CardContent>
        </Card>
        <p className="text-sm text-zinc-300 font-mono leading-relaxed">
          RBAC controls what actions an authenticated identity may perform globally. Authorization is strictly enforced through Next.js middleware, server actions, and relevant on-chain smart-contract controls. 
        </p>
      </div>
    </div>
  </div>
);

const Domain1Section = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center border-b border-white/10 pb-4">
      <h2 className="text-2xl font-mono text-emerald-500">DOMAIN 1: IDENTITY & ASSET POLICY</h2>
      <div className="flex gap-2">
         <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/20">Logical Security Domain</Badge>
         <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/20">Ethereum Sepolia</Badge>
      </div>
    </div>
    <p className="text-sm font-mono text-zinc-400">Domain 1 determines identity verification, role assignment, and digital-asset authorization mapping.</p>
    
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="font-mono text-white mb-2">Contracts:</h3>
        <ContractItem name="IdentityRegistry" addr="0xb2Ad55fD06552E47E4304e3A48AACDdde33808d0" />
        <ContractItem name="RBACManager" addr="0x9b4B628653b0Aa4dAAeccC17273b287e875C61DF" />
        <ContractItem name="AssetRegistry" addr="0x41652715d743C7f9740b83526B09994e60aa61B6" />
        <ContractItem name="AuditAnchor" addr="0xE0f14367d09812f624DCF634d388d6D06d712688" />
      </div>
      <div className="flex flex-col justify-center items-center p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
         <div className="flex flex-col items-center gap-2 font-mono text-sm w-full">
            <div className="bg-black/60 px-4 py-2 rounded w-full text-center border border-white/10">Identity</div>
            <Arrow />
            <div className="bg-black/60 px-4 py-2 rounded w-full text-center border border-white/10">Role</div>
            <Arrow />
            <div className="bg-black/60 px-4 py-2 rounded w-full text-center border border-white/10">Asset + Permission</div>
            <Arrow />
            <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded w-full text-center border border-emerald-500/50 font-bold">Ownership / Access Decision</div>
         </div>
      </div>
    </div>
  </div>
);

const Domain2Section = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center border-b border-white/10 pb-4">
      <h2 className="text-2xl font-mono text-amber-500">DOMAIN 2: KEY & DECRYPTION POLICY</h2>
      <div className="flex gap-2">
         <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/20">Logical Security Domain</Badge>
         <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/20">Ethereum Sepolia</Badge>
      </div>
    </div>
    <p className="text-sm font-mono text-zinc-400">Domain 2 provides an independent security decision exclusively for access to protected encryption material.</p>
    
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="font-mono text-white mb-2">Contracts:</h3>
        <ContractItem name="KeyPolicyManager" addr="0xE31a493DF191fD0fD88c99820d0AfCCEC5F13f80" />
        <ContractItem name="KeyLifecycle" addr="0xBd088a9cd06f59aDaB56202F335EfC300614f743" />
        <ContractItem name="DecryptionAuth" addr="0x65d897450295189230bb49C2b4D83c904A36Fc07" />
      </div>
      <div className="flex flex-col justify-center items-center p-6 border border-amber-500/20 bg-amber-500/5 rounded-xl">
         <div className="flex items-center gap-4 font-mono text-xs w-full justify-center mb-6">
            <div className="bg-black/60 p-3 rounded border border-white/10 text-center">Asset Auth<br/>(Domain 1)</div>
            <span className="text-xl">+</span>
            <div className="bg-black/60 p-3 rounded border border-white/10 text-center">Key Policy<br/>(Domain 2)</div>
         </div>
         <Arrow />
         <div className="mt-4 bg-amber-500/20 text-amber-400 px-6 py-3 rounded text-center border border-amber-500/50 font-bold font-mono">
           Decryption Authorization
         </div>
      </div>
    </div>
    <div className="text-center mt-4">
       <h3 className="text-xl font-bold font-mono text-red-500 glow-text">AUTHORIZATION ≠ DECRYPTION</h3>
       <p className="text-xs font-mono text-zinc-500 mt-2">Authorization to an asset does not automatically authorize access to its encryption key.</p>
    </div>
  </div>
);

const KMSSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">ENCRYPTION & KMS</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4 font-mono text-sm text-zinc-400">
        <p>Protected data is encrypted off-chain using <span className="text-cyan-400 font-bold">AES-256-GCM</span>.</p>
        <p>The encryption key itself is NOT publicly exposed on-chain.</p>
        <p>The KMS protects secret key material. Domain 2 logically controls whether decryption may be authorized by the KMS.</p>
        <p>A <span className="text-emerald-400">temporary/scoped decryption capability</span> limits vulnerability windows.</p>
        <div className="bg-black/40 p-4 border border-white/10 rounded mt-4 text-xs space-y-2">
          <div>• Key Lifecycle</div>
          <div>• Key Versioning</div>
          <div>• Strict Authorization</div>
          <div>• Programmatic Expiration</div>
          <div>• Instant Revocation</div>
        </div>
      </div>
      <div className="space-y-8">
         <div className="flex items-center justify-between font-mono text-xs bg-black/40 p-4 rounded border border-white/10">
           <div className="text-center">PLAINTEXT</div>
           <ChevronRight className="text-primary" />
           <div className="text-center text-cyan-400 border border-cyan-500/50 px-2 py-1 rounded">AES-256-GCM</div>
           <ChevronRight className="text-primary" />
           <div className="text-center text-amber-500">ENCRYPTED DATA</div>
         </div>
         
         <div className="flex items-center justify-between font-mono text-xs bg-black/40 p-4 rounded border border-white/10">
           <div className="text-center">KEY MATL</div>
           <ChevronRight className="text-primary" />
           <div className="text-center text-primary border border-primary/50 px-2 py-1 rounded">KMS</div>
           <ChevronRight className="text-primary" />
           <div className="text-center text-emerald-400">TEMP ACCESS</div>
           <ChevronRight className="text-primary" />
           <div className="text-center text-white font-bold">DECRYPTION</div>
         </div>
      </div>
    </div>
  </div>
);

const SentinelSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">SENTINEL SECURITY ENGINE</h2>
    
    <div className="flex items-center gap-4 mb-6">
       <div className="text-2xl font-bold font-mono text-primary glow-cyan">ACTIVE</div>
       <Badge variant="outline" className="border-primary text-primary font-mono tracking-widest">5/5 DETERMINISTIC CHECKS</Badge>
    </div>
    
    <p className="text-sm font-mono text-zinc-400 mb-6">
      Controlled security validation. Sentinel is deterministic; AI, if present, is not the source of truth for security enforcement.
    </p>

    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
      {[
        'Unauthorized Asset Access',
        'Expired Temporary Key',
        'Revoked Permission Access',
        'Privilege Escalation',
        'Token Replay Attempt'
      ].map((check, i) => (
        <Card key={i} className="bg-black/40 border-white/10">
          <CardContent className="p-3">
             <h4 className="font-mono text-sm text-white mb-2">{i+1}. {check}</h4>
             <div className="flex items-center text-[10px] font-mono gap-2 flex-wrap">
               <span className="text-red-400">Threat</span>
               <ChevronRight className="w-3 h-3 text-zinc-600" />
               <span className="text-amber-400">Detection Condition</span>
               <ChevronRight className="w-3 h-3 text-zinc-600" />
               <span className="text-primary">Security Response</span>
               <ChevronRight className="w-3 h-3 text-zinc-600" />
               <span className="text-emerald-400">Audit/Incident Result</span>
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const TestingSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">SECURITY TEST LAB</h2>
    <p className="text-sm font-mono text-zinc-300">
      SecureMax can run controlled security probes against an isolated/demo test environment to validate security controls.
    </p>
    
    <div className="flex justify-between items-center bg-black/40 p-6 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto">
      <div className="text-center">Trigger</div>
      <ChevronRight className="text-primary mx-2 shrink-0" />
      <div className="text-center text-amber-400 border border-amber-500/30 px-2 py-1 rounded shrink-0">Controlled Probe</div>
      <ChevronRight className="text-primary mx-2 shrink-0" />
      <div className="text-center text-primary shrink-0">Sentinel</div>
      <ChevronRight className="text-primary mx-2 shrink-0" />
      <div className="text-center text-red-400 shrink-0">Finding</div>
      <ChevronRight className="text-primary mx-2 shrink-0" />
      <div className="text-center text-orange-400 shrink-0">Incident</div>
      <ChevronRight className="text-primary mx-2 shrink-0" />
      <div className="text-center text-emerald-400 shrink-0">Audit</div>
      <ChevronRight className="text-primary mx-2 shrink-0" />
      <div className="text-center text-blue-400 shrink-0">Posture</div>
    </div>
    
    <div className="mt-8">
      <h3 className="font-mono text-sm text-zinc-500 mb-4">Available Test Scenarios:</h3>
      <div className="grid grid-cols-2 gap-4">
        {['Token Replay', 'Privilege Escalation', 'Expired Temporary Key', 'Unauthorized Asset Access', 'Revoked Permission Access'].map(s => (
           <div key={s} className="flex justify-between items-center p-3 border border-white/10 bg-black/20 rounded">
             <span className="font-mono text-xs text-zinc-300">{s}</span>
             <Badge variant="outline" className="border-red-500/50 text-red-400 text-[9px] uppercase">CONTROLLED SECURITY TEST</Badge>
           </div>
        ))}
      </div>
    </div>
  </div>
);

const AttackPathSection = () => (
  <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-2xl font-mono text-red-500 border-b border-red-500/30 pb-4 w-full text-left">ATTACK PATH VISUALIZATION</h2>
    
    <div className="flex gap-4 items-center justify-center w-full relative">
       <div className="flex flex-col gap-2 font-mono text-xs w-48">
         <div className="p-2 border border-red-500/50 bg-red-500/10 text-red-400 text-center animate-pulse">THREAT</div>
         <Arrow />
         <div className="p-2 border border-emerald-500/30 bg-black/60 text-center">IDENTITY</div>
         <Arrow />
         <div className="p-2 border border-emerald-500/30 bg-black/60 text-center">SESSION</div>
         <Arrow />
         <div className="p-2 border border-emerald-500/30 bg-black/60 text-center">RBAC</div>
         <Arrow />
         <div className="p-2 border border-emerald-500/30 bg-black/60 text-center">DOMAIN 1</div>
         <Arrow />
         <div className="p-2 border border-red-500 bg-red-500/20 text-red-400 text-center font-bold">DOMAIN 2</div>
         <div className="flex justify-between w-full text-[10px] text-red-500 mt-1 font-bold">
           <span>ACCESS DENIED</span>
           <span>DECRYPTION DENIED</span>
         </div>
         <Arrow />
         <div className="p-2 border border-white/10 bg-black/60 text-center opacity-30">KMS</div>
         <Arrow />
         <div className="p-2 border border-white/10 bg-black/60 text-center opacity-30">DECRYPTION</div>
       </div>

       <div className="flex flex-col gap-4 absolute right-12 top-1/3">
         <div className="w-32 p-3 border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-mono text-xs text-center relative">
           SENTINEL
           <div className="absolute -left-16 top-1/2 w-16 h-[1px] bg-red-500/50"></div>
         </div>
         <div className="w-32 p-3 border border-orange-500/50 bg-orange-500/10 text-orange-400 font-mono text-xs text-center relative">
           INCIDENT
           <div className="absolute left-1/2 -top-4 w-[1px] h-4 bg-cyan-500/50"></div>
         </div>
         <div className="w-32 p-3 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-mono text-xs text-center relative">
           AUDIT
           <div className="absolute left-1/2 -top-4 w-[1px] h-4 bg-orange-500/50"></div>
         </div>
       </div>
    </div>
  </div>
);

const FailClosedSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">FAIL-CLOSED ENFORCEMENT</h2>
    <p className="text-sm font-mono text-zinc-300 mb-6">
      If required security state cannot be verified, the decision defaults to DENY rather than granting access.
    </p>
    
    <div className="space-y-4 max-w-2xl">
      {[
        ['Identity unavailable', 'DENY'],
        ['Asset authorization unavailable', 'DENY'],
        ['Key authorization unavailable', 'DENY'],
        ['KMS authorization unavailable', 'DENY'],
        ['Policy / oracle failure', 'DENY']
      ].map(([cond, res], i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded">
          <span className="font-mono text-sm text-zinc-300">{cond}</span>
          <div className="flex items-center gap-4">
            <ChevronRight className="w-4 h-4 text-red-500" />
            <Badge variant="destructive" className="font-mono tracking-widest">{res}</Badge>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CrossDomainSection = () => (
  <div className="space-y-8 flex flex-col items-center">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4 w-full text-left">CROSS-DOMAIN AUTHORIZATION</h2>
    <p className="text-sm font-mono text-zinc-400 w-full text-left mb-4">Only allow the final conceptual path when BOTH required security decisions succeed.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <div className="flex flex-col items-center p-6 border border-emerald-500/30 bg-black/40 rounded-xl space-y-4">
         <div className="flex items-center gap-2 font-mono text-sm"><CheckCircle2 className="text-emerald-500"/> Domain 1</div>
         <div className="flex items-center gap-2 font-mono text-sm"><CheckCircle2 className="text-emerald-500"/> Domain 2</div>
         <div className="w-full h-[1px] bg-white/10"></div>
         <Badge className="bg-emerald-500/20 text-emerald-400 font-mono">DECRYPTION AUTHORIZED</Badge>
      </div>

      <div className="flex flex-col items-center p-6 border border-red-500/30 bg-black/40 rounded-xl space-y-4">
         <div className="flex items-center gap-2 font-mono text-sm"><CheckCircle2 className="text-emerald-500"/> Domain 1</div>
         <div className="flex items-center gap-2 font-mono text-sm"><XCircle className="text-red-500"/> Domain 2</div>
         <div className="w-full h-[1px] bg-white/10"></div>
         <Badge variant="destructive" className="font-mono">DECRYPTION DENIED</Badge>
      </div>

      <div className="flex flex-col items-center p-6 border border-red-500/30 bg-black/40 rounded-xl space-y-4">
         <div className="flex items-center gap-2 font-mono text-sm"><XCircle className="text-red-500"/> Domain 1</div>
         <div className="flex items-center gap-2 font-mono text-sm"><CheckCircle2 className="text-emerald-500"/> Domain 2</div>
         <div className="w-full h-[1px] bg-white/10"></div>
         <Badge variant="destructive" className="font-mono">DECRYPTION DENIED</Badge>
      </div>
    </div>
    
    <h3 className="text-2xl font-bold font-mono text-red-500 glow-text mt-8">AUTHORIZATION ≠ DECRYPTION</h3>
  </div>
);

const TemporaryAccessSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">TEMPORARY ACCESS</h2>
    <p className="text-sm font-mono text-zinc-300">
      Temporary decryption capability is scoped by security policy and lifecycle state.
    </p>
    
    <div className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-6 rounded-xl border border-white/10 font-mono text-[10px] sm:text-xs overflow-x-auto gap-2 w-full">
      <div className="text-center text-emerald-400 shrink-0">ACCESS GRANTED</div>
      <ChevronRight className="text-primary shrink-0" />
      <div className="text-center text-cyan-400 shrink-0">CAPABILITY CREATED</div>
      <ChevronRight className="text-primary shrink-0" />
      <div className="text-center text-white shrink-0">ACTIVE</div>
      <ChevronRight className="text-primary shrink-0" />
      <div className="text-center text-amber-400 shrink-0">EXPIRATION</div>
      <ChevronRight className="text-primary shrink-0" />
      <div className="text-center text-zinc-500 shrink-0">EXPIRED</div>
      <ChevronRight className="text-red-500 shrink-0" />
      <div className="text-center text-red-500 font-bold shrink-0">DECRYPTION DENIED</div>
    </div>

    <div className="flex items-center gap-4 mt-8 p-4 border border-red-500/30 bg-red-500/5 rounded w-full max-w-md mx-auto">
      <span className="font-mono text-sm text-amber-500">REVOKED STATE</span>
      <Arrow />
      <Badge variant="destructive" className="font-mono">DECRYPTION DENIED</Badge>
    </div>
  </div>
);

const AuditSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">AUDIT & FORENSICS</h2>
    
    <div className="flex flex-col items-center p-8 bg-black/40 border border-white/10 rounded-xl space-y-4">
       <div className="flex items-center gap-4 w-full max-w-2xl justify-between font-mono text-xs">
         <div className="p-3 border border-white/20 rounded bg-white/5">EVENT</div>
         <ChevronRight className="text-primary" />
         <div className="p-3 border border-primary/50 rounded bg-primary/10 text-primary">HASH</div>
         <ChevronRight className="text-primary" />
         <div className="p-3 border border-emerald-500/50 rounded bg-emerald-500/10 text-emerald-400">PREVIOUS HASH</div>
         <ChevronRight className="text-primary" />
         <div className="p-3 border border-emerald-500/50 rounded bg-emerald-500/10 text-emerald-400">CURRENT HASH</div>
         <ChevronRight className="text-primary" />
         <div className="p-3 border border-cyan-500/50 rounded bg-cyan-500/10 text-cyan-400 font-bold">INTEGRITY VERIFICATION</div>
       </div>
    </div>

    <Card className="bg-black/40 border-white/10 mt-6">
      <CardContent className="p-6 space-y-4 font-mono text-sm text-zinc-400">
        <p>The application employs a <strong>tamper-evident application audit model</strong>.</p>
        <p><strong>AuditAnchor</strong> smart contract on Sepolia anchors cryptographic hashes of application events to prove historical integrity.</p>
        <p className="text-amber-500/80 italic mt-4">Note: Complete payload logs are retained in the application database; only verifiable cryptographic anchors are submitted on-chain for efficiency and privacy.</p>
      </CardContent>
    </Card>
  </div>
);

const IncidentSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">FROM DETECTION TO CONTAINMENT</h2>
    
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[10px] text-center max-w-4xl mx-auto mb-8">
      <div className="p-2 border border-white/10 bg-black/40 rounded">Security Attempt</div>
      <div className="p-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 rounded">Sentinel Detection</div>
      <div className="p-2 border border-red-500/30 bg-red-500/10 text-red-400 rounded">Access Denied</div>
      <div className="p-2 border border-orange-500/30 bg-orange-500/10 text-orange-400 rounded">Incident Created</div>
      <div className="p-2 border border-white/10 bg-black/40 rounded">Investigation</div>
      <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded">Audit</div>
      <div className="p-2 border border-emerald-500/50 bg-emerald-500/20 text-emerald-500 font-bold rounded">Containment</div>
      <div className="p-2 border border-white/10 bg-black/40 rounded">Recovery</div>
    </div>

    <Card className="bg-black/40 border-red-500/30 w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-red-400 flex justify-between items-center">
          <span>SAMPLE INCIDENT RECORD</span>
          <Badge variant="outline" className="border-red-500 text-red-500 text-[9px]">SIMULATED ATTACK</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 font-mono text-xs">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-zinc-500">Attack Type:</span><span className="text-white">Token Replay Attempt</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-zinc-500">Severity:</span><span className="text-red-400 font-bold">HIGH</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-zinc-500">Detection Layer:</span><span className="text-cyan-400">Sentinel Engine</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-zinc-500">Blocked Layer:</span><span className="text-amber-500">Domain 2: Key Policy</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-zinc-500">Affected Asset:</span><span className="text-white">BEL-AVI-003</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-zinc-500">Status:</span><span className="text-emerald-500 font-bold">THREAT CONTAINED</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ContractsSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">SMART CONTRACT LAYER</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-emerald-500 font-mono font-bold">DOMAIN 1</h3>
        <ContractDesc name="IdentityRegistry" role="Registers decentralized identities and public keys." state="DID records" />
        <ContractDesc name="RBACManager" role="Stores global role assignments." state="Role mappings" />
        <ContractDesc name="AssetRegistry" role="Tracks asset ownership and classification." state="Asset metadata" />
        <ContractDesc name="AuditAnchor" role="Stores cryptographic hashes of events." state="Hash chain" />
      </div>
      <div className="space-y-4">
        <h3 className="text-amber-500 font-mono font-bold">DOMAIN 2</h3>
        <ContractDesc name="KeyPolicyManager" role="Governs access rules for specific encryption keys." state="Key policies" />
        <ContractDesc name="KeyLifecycle" role="Tracks key rotation, expiration, and revocation." state="Key status" />
        <ContractDesc name="DecryptionAuth" role="Issues verifiable authorization tokens." state="Auth logs" />
      </div>
    </div>
  </div>
);

const PreflightSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">TRANSACTION PRE-FLIGHT</h2>
    <p className="text-sm font-mono text-zinc-300">
      Administrative blockchain transactions require wallet authorization (gas). SecureMax executes a strict pre-flight check before prompting MetaMask.
    </p>
    
    <div className="flex flex-wrap gap-2 text-[10px] font-mono items-center justify-center p-6 bg-black/40 rounded-xl border border-white/10">
      <div className="p-2 border border-white/20 rounded">ADMIN REQUEST</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-emerald-500/30 text-emerald-400 rounded">NETWORK CHECK</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-emerald-500/30 text-emerald-400 rounded">CALLER CHECK</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-emerald-500/30 text-emerald-400 rounded">RBAC CHECK</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-emerald-500/30 text-emerald-400 rounded">CONTRACT CHECK</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-amber-500/30 text-amber-400 rounded">SIMULATION / GAS</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-orange-500/50 bg-orange-500/10 text-orange-400 font-bold rounded">METAMASK</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-white/20 rounded">TRANSACTION</div><ChevronRight className="w-3 h-3 text-primary"/>
      <div className="p-2 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold rounded">CONFIRMED</div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-6">
       <Card className="bg-black/40 border-white/10">
         <CardHeader><CardTitle className="text-xs font-mono text-primary">Authentication</CardTitle></CardHeader>
         <CardContent className="font-mono text-sm text-zinc-400">Uses <strong className="text-white">SIGNATURE</strong>. Zero gas, off-chain verification.</CardContent>
       </Card>
       <Card className="bg-black/40 border-white/10">
         <CardHeader><CardTitle className="text-xs font-mono text-primary">Blockchain State Change</CardTitle></CardHeader>
         <CardContent className="font-mono text-sm text-zinc-400">Uses <strong className="text-white">TRANSACTION + GAS</strong>. Requires mining confirmation.</CardContent>
       </Card>
    </div>
  </div>
);

const StackSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">TECHNOLOGY STACK</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm text-center">
      <StackItem name="Next.js" />
      <StackItem name="TypeScript" />
      <StackItem name="React" />
      <StackItem name="Tailwind CSS" />
      <StackItem name="Framer Motion" />
      <StackItem name="Solidity" />
      <StackItem name="OpenZeppelin" />
      <StackItem name="Hardhat" />
      <StackItem name="viem / ethers" />
      <StackItem name="wagmi" />
      <StackItem name="MetaMask" />
      <StackItem name="Ethereum Sepolia" />
      <StackItem name="Supabase PostgreSQL" />
      <StackItem name="Supabase Storage" />
      <StackItem name="AES-256-GCM" />
      <StackItem name="KMS Abstraction" />
    </div>
  </div>
);

const RoadmapSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">IMPLEMENTED VS ROADMAP</h2>
    <div className="grid gap-3 max-w-2xl">
      <RoadmapItem name="Next.js Full-Stack Application" status="IMPLEMENTED" />
      <RoadmapItem name="EIP-191 Auth & Secure Session JWT" status="IMPLEMENTED" />
      <RoadmapItem name="Dual-Domain Policy Enforcement" status="IMPLEMENTED" />
      <RoadmapItem name="AES-256-GCM Encryption" status="IMPLEMENTED" />
      <RoadmapItem name="Sentinel Engine Checks (5 vectors)" status="IMPLEMENTED" />
      <RoadmapItem name="Tamper-Evident AuditAnchor" status="IMPLEMENTED" />
      
      <RoadmapItem name="Simulated Threat Injection" status="DEMO / SIMULATION" />
      <RoadmapItem name="Full Autonomous Agent AI" status="DEMO / SIMULATION" />
      
      <RoadmapItem name="Hardware Security Module (HSM)" status="ROADMAP" />
      <RoadmapItem name="Zero-Knowledge Proofs (ZKP)" status="ROADMAP" />
      <RoadmapItem name="Verifiable Credentials" status="ROADMAP" />
      <RoadmapItem name="IoT Device Integration" status="ROADMAP" />
    </div>
  </div>
);

const WhySection = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-mono text-primary border-b border-white/10 pb-4">WHY SECUREMAX?</h2>
    
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-black/40 border-red-500/30">
        <CardHeader><CardTitle className="text-sm font-mono text-red-400">TRADITIONAL ACCESS MODEL</CardTitle></CardHeader>
        <CardContent className="space-y-2 font-mono text-xs text-zinc-400">
          <div className="p-2 border border-white/5 bg-white/5 text-center">Identity</div>
          <Arrow />
          <div className="p-2 border border-white/5 bg-white/5 text-center">Authorization</div>
          <Arrow />
          <div className="p-2 border border-red-500/50 bg-red-500/10 text-red-400 text-center font-bold">Data Access</div>
          <p className="mt-4 text-zinc-500 text-center italic">Single point of failure. Application compromise exposes raw data.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border-emerald-500/30">
        <CardHeader><CardTitle className="text-sm font-mono text-emerald-400">SECUREMAX MODEL</CardTitle></CardHeader>
        <CardContent className="space-y-2 font-mono text-xs text-zinc-400">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <div className="p-2 border border-white/5 bg-white/5 text-center">Identity</div>
              <Arrow />
              <div className="p-2 border border-white/5 bg-white/5 text-center">Session</div>
              <Arrow />
              <div className="p-2 border border-white/5 bg-white/5 text-center">RBAC</div>
              <Arrow />
              <div className="p-2 border border-white/5 bg-white/5 text-center">Asset Auth</div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="p-2 border border-white/5 bg-white/5 text-center">Key Auth</div>
              <Arrow />
              <div className="p-2 border border-white/5 bg-white/5 text-center">KMS</div>
              <Arrow />
              <div className="p-2 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-center font-bold h-[76px] flex items-center justify-center">Decryption</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div className="text-center p-6 border border-cyan-500/30 bg-cyan-500/5 rounded-xl">
      <h3 className="text-xl font-bold font-mono text-cyan-400">An authorized identity does not automatically receive decryption authority.</h3>
    </div>
  </div>
);

// Helpers
const Arrow = () => <div className="h-4 w-[1px] bg-white/20 mx-auto my-1"></div>;

const Node = ({ label, type, onClick }: { label: string, type: 'auth'|'success'|'warning'|'secure'|'default', onClick?: () => void }) => {
  const colors = {
    auth: 'border-white/20 bg-white/5 text-white',
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    secure: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
    default: 'border-white/10 bg-black/40 text-zinc-400'
  };
  return (
    <div onClick={onClick} className={`px-6 py-3 rounded-lg border font-mono text-sm text-center shadow-lg backdrop-blur-sm cursor-pointer hover:brightness-125 transition-all ${colors[type]}`}>
      {label}
    </div>
  );
};

const ContractItem = ({ name, addr }: { name: string, addr: string }) => (
  <div className="p-3 bg-black/40 border border-white/10 rounded">
    <div className="text-sm font-mono text-primary">{name}</div>
    <div className="text-[10px] font-mono text-zinc-500">{addr}</div>
  </div>
);

const ContractDesc = ({ name, role, state }: { name: string, role: string, state: string }) => (
  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-1">
    <div className="text-sm font-mono text-white">{name}</div>
    <div className="text-xs font-mono text-zinc-400">{role}</div>
    <div className="text-[10px] font-mono text-zinc-500">State: {state}</div>
  </div>
);

const StackItem = ({ name }: { name: string }) => (
  <div className="p-3 border border-white/5 bg-black/40 rounded text-zinc-300 shadow-sm">{name}</div>
);

const RoadmapItem = ({ name, status }: { name: string, status: string }) => {
  let badgeColor = 'bg-zinc-800 text-zinc-400';
  if (status === 'IMPLEMENTED') badgeColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  if (status === 'DEMO / SIMULATION') badgeColor = 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
  if (status === 'ROADMAP') badgeColor = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
  
  return (
    <div className="flex justify-between items-center p-3 border border-white/5 bg-black/40 rounded">
      <span className="font-mono text-sm text-white">{name}</span>
      <Badge className={`font-mono text-[10px] ${badgeColor}`}>{status}</Badge>
    </div>
  );
};
const FlowBlock = ({ label }: { label: string }) => <div className="px-4 py-2 bg-black/60 border border-white/10 rounded text-center text-xs text-white shadow-sm font-mono mb-2">{label}</div>;
