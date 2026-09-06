import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabaseAdmin } from '@/lib/db/client';
import { getVerifiedSession } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';

export default async function UserDashboardPage() {
  const session = await getVerifiedSession();

  const { data: assignments } = await supabaseAdmin
    .from('asset_assignments')
    .select('*, assets(name, classification)')
    .eq('user_id', session.userId)
    .eq('status', 'ACTIVE');

  const { data: requests } = await supabaseAdmin
    .from('access_requests')
    .select('*, assets(name)')
    .eq('user_id', session.userId)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My Access</h2>
          <p className="text-muted-foreground mt-1">Manage your authorized digital assets and requests.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 px-4 py-1.5 font-mono">
            ROLE: ENGINEER
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className=" border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Authorized Assets
              </CardTitle>
              <CardDescription>Data you currently have cryptographic clearance to access.</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments && assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment: any) => (
                    <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md bg-black/40 border border-zinc-800 hover:border-primary/50 transition-colors">
                      <div>
                        <h4 className="font-semibold text-foreground">{assignment.assets?.name || 'Unknown Asset'}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] text-muted-foreground border-zinc-800">
                            {assignment.assets?.classification || 'CONFIDENTIAL'}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">ID: {assignment.asset_id.substring(0,8)}...</span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                         <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                           <Key className="w-4 h-4 mr-2" /> Request Decryption Token
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You do not have active access to any encrypted assets.</p>
                  <Button variant="outline" className="mt-4 border-white/20">Browse Registry</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className=" border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
               {requests && requests.length > 0 ? (
                 <div className="space-y-4">
                   {requests.map((req: any) => (
                     <div key={req.id} className="flex justify-between items-start border-b border-zinc-800 pb-3 last:border-0">
                       <div>
                         <p className="text-sm font-medium">{req.assets?.name || 'Asset Access'}</p>
                         <p className="text-xs text-muted-foreground font-mono mt-1">{new Date(req.created_at).toLocaleDateString()}</p>
                       </div>
                       <Badge variant={req.status === 'APPROVED' ? 'outline' : 'secondary'} className={req.status === 'APPROVED' ? 'text-emerald-400 border-emerald-400/30' : req.status === 'PENDING' ? 'text-amber-400 bg-amber-400/10' : ''}>
                         {req.status}
                       </Badge>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground text-center py-6">No recent requests.</p>
               )}
            </CardContent>
          </Card>

          <Card className=" border-zinc-800 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/20 via-card to-card">
            <CardHeader>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Secure Context Active</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Device: MAC_OS_ENCLAVE_1</p>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Clock className="w-3 h-3" />
                  <span>Token exp: 29m 45s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
