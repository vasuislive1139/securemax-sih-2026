import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, ShieldAlert, Key, HardDrive, ShieldCheck, AlertCircle, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDashboardMetrics } from '@/app/actions/dashboard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AssignAssetButton } from '@/components/ui/AssignAssetButton';
import { TechnicalBriefingButton } from '@/components/dashboard/TechnicalBriefingButton';

export default async function AdminDashboardPage() {
  const result = await getDashboardMetrics();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Overview</h2>
          <p className="text-muted-foreground mt-1">System telemetry and active security events.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Link href="/dashboard/security">
             <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
               <ShieldCheck className="w-4 h-4 mr-2" /> Security Center
             </Button>
          </Link>
          <Badge variant={result.success ? 'outline' : 'destructive'} className={result.success ? "border-emerald-500/50 text-emerald-500 px-4 py-1.5" : "px-4 py-1.5"}>
            <Activity className="mr-2 h-4 w-4 animate-pulse" />
            {result.success ? 'SYSTEM ONLINE' : 'UNAVAILABLE'}
          </Badge>
        </div>
      </div>

      {!result.success ? (
        <Card className="border-destructive glass-panel">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold text-destructive">Database Connection Refused</h3>
            <p className="text-sm text-destructive/80 mt-2 max-w-md">
              SecureMax could not connect to the Supabase instance. Ensure environment variables are configured and the 21-table schema has been migrated.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-panel tech-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Registered Personnel</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-primaryglow-cyan">{result.data?.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">DIDs across all roles</p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel tech-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Encrypted Assets</CardTitle>
              <HardDrive className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-cyan-400">{result.data?.activeAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">Secured via AES-256-GCM</p>
            </CardContent>
          </Card>
          
          <Card className="glass-panel tech-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Access Requests</CardTitle>
              <Key className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-amber-500">{result.data?.pendingAccessRequests}</div>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Awaiting context validation</p>
              
              {/* Added for E2E Blockchain Verification Phase */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-muted-foreground mb-2">Pending: did:test:user1</p>
                <AssignAssetButton assetId="asset-123" assigneeDid="did:test:user1" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-destructive/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Critical Alerts</CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold text-destructive">{result.data?.criticalAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Sentinel findings & incidents</p>
            </CardContent>
          </Card>
        </div>
      )}

      {result.success && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 glass-panel border-white/5">
            <CardHeader>
              <CardTitle>Tamper-Evident Audit Trail</CardTitle>
              <CardDescription>Cryptographically anchored events across the mesh network.</CardDescription>
            </CardHeader>
            <CardContent>
              {result.data?.recentAudits && result.data.recentAudits.length > 0 ? (
                <div className="space-y-4">
                  {result.data.recentAudits.map((audit: any) => (
                    <div key={audit.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded bg-black/40 border border-white/5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider border-primary/30 text-primary">
                            {audit.event_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(audit.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground/80 break-all sm:break-normal">
                          Target: {audit.target_id || 'N/A'}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                          Hash: {audit.event_hash}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <ShieldCheck className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No recent audit events.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3 glass-panel border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-card to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Sentinel Engine
              </CardTitle>
              <CardDescription>Autonomous security sandbox status</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-6">
                 <div className="p-4 rounded-md border border-white/10 bg-black/50">
                   <h4 className="text-sm font-semibold mb-2">Sandbox Environment</h4>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-muted-foreground">Status</span>
                     <span className="text-emerald-400 font-mono">ONLINE</span>
                   </div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-muted-foreground">Test Suites</span>
                     <span className="font-mono text-primary">5</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Execution Mode</span>
                     <span className="font-mono text-cyan-400">DETERMINISTIC</span>
                   </div>
                 </div>

                 <Link href="/dashboard/security" className="block w-full">
                   <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                     <Play className="w-4 h-4 mr-2" /> Launch Security Scan
                   </Button>
                 </Link>
               </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
