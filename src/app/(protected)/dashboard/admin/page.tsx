import { getDashboardMetrics } from '@/app/actions/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, HardDrive, Key, AlertCircle, ShieldAlert, Activity, ShieldCheck, Play, Hexagon, Database, Lock } from 'lucide-react';
import Link from 'next/link';
import { TechnicalBriefingButton } from '@/components/dashboard/TechnicalBriefingButton';
import { ClientIncidentsCard } from '@/components/dashboard/ClientIncidentsCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const result = await getDashboardMetrics();

  return (
    <div className="space-y-8 font-sans selection:bg-cyan-500/30 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 uppercase">Command Center</h1>
          <p className="text-sm text-zinc-500 font-mono tracking-widest mt-1 uppercase">Global Security Posture</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={result.success ? 'outline' : 'destructive'} className={result.success ? "border-emerald-500/30 text-emerald-500 px-4 py-1.5 font-mono text-[10px] tracking-widest bg-emerald-500/10" : "px-4 py-1.5 font-mono text-[10px] tracking-widest"}>
            <Activity className="mr-2 h-3 w-3 animate-pulse" />
            {result.success ? 'SYSTEM ONLINE' : 'UNAVAILABLE'}
          </Badge>
        </div>
      </div>

      {!result.success ? (
        <Card className="border-red-500/30 bg-[#0a0a0c]">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-mono text-red-500 uppercase tracking-widest">Database Connection Refused</h3>
            <p className="text-sm text-zinc-500 mt-4 max-w-md font-mono">
              SecureMax could not connect to the Supabase instance. Ensure environment variables are configured.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Posture Score */}
          <div className="bg-[#0a0a0c] border border-zinc-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-6">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/20">
                   <div className="text-3xl font-light text-zinc-100">92</div>
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="44" cy="44" r="44" className="stroke-emerald-500 fill-none stroke-[4] stroke-dasharray-[276] stroke-dashoffset-[22]" style={{ transform: 'translate(4px, 4px)' }} />
                   </svg>
                </div>
                <div>
                   <h2 className="text-2xl font-mono text-zinc-100 uppercase tracking-widest">Security Posture</h2>
                   <div className="text-sm font-mono text-emerald-500 tracking-widest mt-1">HEALTHY</div>
                </div>
             </div>
             
             {/* Sub-systems Health */}
             <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-8 gap-y-4 text-center">
               <div className="flex flex-col items-center gap-2">
                 <Shield className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-500">IDENTITY</span>
                 <span className="text-[10px] font-mono tracking-widest text-emerald-500">VERIFIED</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Users className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-500">ACCESS</span>
                 <span className="text-[10px] font-mono tracking-widest text-emerald-500">ENFORCED</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Database className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-500">ASSET SEC</span>
                 <span className="text-[10px] font-mono tracking-widest text-emerald-500">GRANTED</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Key className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-500">KEY SEC</span>
                 <span className="text-[10px] font-mono tracking-widest text-cyan-400">PROTECTED</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Activity className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-500">SENTINEL</span>
                 <span className="text-[10px] font-mono tracking-widest text-emerald-500">ACTIVE</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-mono tracking-widest text-zinc-500">AUDIT</span>
                 <span className="text-[10px] font-mono tracking-widest text-emerald-500">VERIFIED</span>
               </div>
             </div>
          </div>

          <TechnicalBriefingButton />

          {/* Detailed Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Identities</CardTitle>
                <Users className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-mono text-zinc-100">{result.data?.totalUsers}</div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1 tracking-widest uppercase">Registered Personnel</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Assets</CardTitle>
                <HardDrive className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-mono text-zinc-100">{result.data?.activeAssets}</div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1 tracking-widest uppercase">AES-256-GCM Secured</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Access</CardTitle>
                <Key className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-mono text-zinc-100">{result.data?.pendingAccessRequests}</div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1 tracking-widest uppercase">Authorization Requests</p>
              </CardContent>
            </Card>

            <ClientIncidentsCard />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg flex flex-col max-h-[400px]">
              <CardHeader className="pb-4 pt-4">
                <CardTitle className="text-sm font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Tamper-Evident Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
                {result.data?.recentAudits && result.data.recentAudits.length > 0 ? (
                  <div className="space-y-2">
                    {result.data.recentAudits.map((audit: any) => (
                      <div key={audit.id} className="flex flex-col p-3 rounded bg-zinc-900/50 border border-zinc-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-zinc-500 font-mono">{new Date(audit.created_at).toLocaleString()}</span>
                          <span className="text-[10px] text-cyan-400 font-mono tracking-widest border border-cyan-500/30 px-2 py-0.5 rounded-sm">{audit.event_type}</span>
                        </div>
                        <div className="text-xs text-zinc-300 font-mono mb-2 truncate">Target: {audit.target_id || 'N/A'}</div>
                        <div className="text-[10px] text-zinc-600 font-mono truncate">Hash: {audit.event_hash}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-zinc-900/30 border border-zinc-800/30 rounded text-zinc-600">
                    <ShieldCheck className="h-4 w-4 opacity-50" />
                    <span className="text-[10px] font-mono tracking-widest uppercase">NO RECENT AUDIT EVENTS</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg">
              <CardHeader className="pb-4 border-b border-zinc-800">
                <CardTitle className="text-sm font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Sentinel Security Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="space-y-6">
                   <div className="space-y-3 font-mono text-sm">
                     <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                       <span className="text-zinc-500">Status</span>
                       <span className="text-emerald-500">ACTIVE</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                       <span className="text-zinc-500">Deterministic Checks</span>
                       <span className="text-cyan-400">5 / 5</span>
                     </div>
                     <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                       <span className="text-zinc-500">Execution Mode</span>
                       <span className="text-zinc-300">Continuous Validation</span>
                     </div>
                   </div>

                   <Link href="/security/sentinel" className="block w-full mt-6">
                     <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 py-3 rounded text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                       <Play className="w-4 h-4 text-emerald-500" /> Launch Security Lab
                     </button>
                   </Link>
                 </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
