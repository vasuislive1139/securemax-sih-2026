'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Key, Activity, Database, Server, 
  ChevronRight, Github, ExternalLink, ShieldAlert, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          className="container mx-auto px-6 relative z-10 text-center"
          initial="hidden" animate="visible" variants={STAGGER}
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-8 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Defense-Grade Security Architecture
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            SECURITY BEYOND <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">AUTHORIZATION.</span>
          </motion.h1>
          
          <motion.p variants={FADE_UP} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            A defense-in-depth platform for decentralized identity, digital asset protection, 
            and autonomous security validation. Engineered for absolute zero-trust environments.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/admin">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-sm">
                Explore Platform <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="https://github.com/your-repo/securemesh" target="_blank">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-border hover:bg-accent rounded-sm">
                <Github className="mr-2 w-4 h-4" /> GitHub Repository
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE SECURITY PROBLEM */}
      <section className="py-24 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="max-w-4xl mx-auto text-center">
            <motion.h2 variants={FADE_UP} className="text-3xl md:text-5xl font-bold mb-6">The Perimeter is Dead.</motion.h2>
            <motion.p variants={FADE_UP} className="text-lg text-muted-foreground leading-relaxed">
              Traditional RBAC assumes that if a user is authorized, they should inherently be able to decrypt data. 
              In modern distributed systems, this allows a single database compromise or IDOR vulnerability to yield full cryptographic plaintext.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 3. WHY AUTHORIZATION ALONE IS INSUFFICIENT */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
              <motion.h2 variants={FADE_UP} className="text-3xl font-bold mb-6">Authorization ≠ Decryption</motion.h2>
              <motion.p variants={FADE_UP} className="text-muted-foreground mb-6 leading-relaxed">
                SecureMesh enforces a strict cryptographic boundary. Knowing <span className="text-primary">who</span> you are (Identity) 
                and what you are <span className="text-primary">allowed</span> to do (Authorization) does not automatically 
                grant you the <span className="text-primary">cryptographic material</span> required to do it.
              </motion.p>
              <motion.ul variants={STAGGER} className="space-y-4">
                {[
                  'Database records do not contain decryption keys.',
                  'Compromised API endpoints yield useless ciphertext.',
                  'Access revocation strictly destroys Key Management Session bindings.'
                ].map((item, i) => (
                  <motion.li key={i} variants={FADE_UP} className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="glass-panel p-8 tech-border relative aspect-square md:aspect-auto md:h-[400px] flex items-center justify-center"
            >
              <div className="absolute inset-0 grid-pattern opacity-20"></div>
              <div className="text-center relative z-10">
                <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
                <div className="text-sm font-mono text-muted-foreground">AES-256-GCM / HKDF Derived KEK</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 & 5. DEFENSE-IN-DEPTH & TWO BLOCKCHAIN DOMAINS */}
      <section className="py-24 border-y border-white/5 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dual-Domain Blockchain Architecture</h2>
            <p className="text-muted-foreground">Separating concerns to prevent single points of catastrophic failure.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP} className="glass-panel p-8">
              <Database className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">Chain 1: Identity & Access</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Handles Decentralized Identifiers (DIDs), strict Role-Based Access Control matrices, 
                and non-fungible asset ownership records. Serves as the ultimate source of truth for authorization.
              </p>
              <ul className="text-xs font-mono space-y-2 text-primary/80">
                <li>→ IdentityRegistry.sol</li>
                <li>→ RBACManager.sol</li>
                <li>→ AssetRegistry.sol</li>
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP} className="glass-panel p-8">
              <Key className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">Chain 2: Key Security</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Operates securely in a separate domain. Manages key lifecycles, policy enforcement, 
                and cryptographic rotation constraints without ever storing raw key material on-chain.
              </p>
              <ul className="text-xs font-mono space-y-2 text-cyan-400/80">
                <li>→ KeyLifecycle.sol</li>
                <li>→ KeyPolicyManager.sol</li>
                <li>→ DecryptionAuth.sol</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7, 8, 9. ENCRYPTED ASSETS, TEMP KEYS, CONTEXT */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20">
                <FileLockIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Encrypted Digital Assets</h3>
              <p className="text-sm text-muted-foreground">Every digital asset is secured using AES-256-GCM envelope encryption. Raw data remains heavily fortified off-chain.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20">
                <ClockIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Temporary Key Access</h3>
              <p className="text-sm text-muted-foreground">Decryption tokens are cryptographically bound to specific sessions and strictly self-destruct after 30 minutes.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary/20">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Context-Aware Orchestration</h3>
              <p className="text-sm text-muted-foreground">The API layer explicitly requires Chain 1, Chain 2, and DB RLS consensus before authorizing any cryptographic operation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10, 11, 12. SENTINEL & SANDBOX */}
      <section className="py-24 bg-card/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-primary border-primary bg-primary/10">Sentinel Engine</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Autonomous Security Sandbox</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Security cannot be an afterthought. Sentinel is a deterministic engine that continuously executes real attack 
              vectors against an isolated application boundary to verify defenses hold firm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { title: 'Deterministic Testing', desc: 'No faked logic. Executes real requests targeting privilege escalation and token replays.' },
                { title: 'Risk-Based Response', desc: 'Automatically freezes compromised sandbox routes or alerts administrators dynamically.' },
                { title: 'False Positive Prevention', desc: 'Engine correctly identifies when the KMS orchestrator successfully drops a malicious request.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 h-full bg-primary mt-1 shrink-0"></div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass-panel p-6 tech-border">
               <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                 <span className="text-sm font-mono">system@sentinel:~$ ./run_scan</span>
                 <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
               </div>
               <div className="font-mono text-xs space-y-2 text-muted-foreground">
                 <p className="text-emerald-400">[PASS] Validated Expired JWT Rejection</p>
                 <p className="text-emerald-400">[PASS] Validated Unauthorized Asset Fetch</p>
                 <p className="text-emerald-400">[PASS] Validated Chain-1 Rejection Fallback</p>
                 <p className="text-emerald-400">[PASS] Validated Revoked Access Denied</p>
                 <p className="text-primary mt-4">Scan complete. 0 CRITICAL findings.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. AUDIT TRAIL */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Tamper-Evident Audit Trail</h2>
          <p className="text-muted-foreground mb-8">
            Every critical state transition—from role assignment to decryption completion—is irreversibly logged. 
            Previous event hashes are cryptographically chained to prevent retroactive log alteration.
          </p>
          <div className="p-4 bg-accent/20 border border-white/10 rounded font-mono text-xs overflow-x-auto text-left">
            <span className="text-primary">SHA256:</span> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </div>
        </div>
      </section>

      {/* 16. FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Experience SecureMesh</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/admin">
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-sm">
                Access Live Prototype
              </Button>
            </Link>
            <Link href="https://github.com/your-repo/securemesh" target="_blank">
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-sm">
                View Source Code
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// Minimal icons for this page
function FileLockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <rect x="8" y="12" width="8" height="6" rx="1" />
      <path d="M10 12v-2a2 2 0 1 1 4 0v2" />
    </svg>
  );
}

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Badge({ children, className = '', variant = 'default' }: any) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${className}`}>
      {children}
    </span>
  );
}
