'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle, ArrowRight, ShieldCheck, FileSearch } from 'lucide-react';
import { useDemoStore } from '@/stores/useDemoStore';

export default function IncidentsPage() {
  const { incidents, resolveIncident } = useDemoStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <AlertTriangle className="mr-3 h-8 w-8 text-amber-500" />
            Incident Center
          </h2>
          <p className="text-muted-foreground mt-1">Investigation and containment tracking.</p>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.length === 0 ? (
          <Card className="glass-panel tech-border border-white/5 opacity-70">
             <CardContent className="flex flex-col items-center justify-center py-16">
               <ShieldCheck className="h-12 w-12 text-emerald-500/50 mb-4" />
               <p className="text-emerald-400 font-mono text-sm">NO ACTIVE INCIDENTS</p>
             </CardContent>
          </Card>
        ) : (
          incidents.map((incident) => (
            <Card key={incident.id} className={`glass-panel ${incident.status === 'OPEN' ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className={`text-lg ${incident.status === 'OPEN' ? 'text-amber-500' : 'text-foreground'}`}>
                      {incident.title}
                    </CardTitle>
                    <Badge variant="outline" className={incident.status === 'OPEN' ? 'border-amber-500 text-amber-500' : 'border-emerald-500 text-emerald-500'}>
                      {incident.status}
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-xs mt-1">ID: {incident.id}</CardDescription>
                </div>
                
                {incident.status === 'OPEN' && (
                  <Button onClick={() => resolveIncident(incident.id)} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                     <ShieldCheck className="w-4 h-4 mr-2" /> CONTAIN THREAT & RECOVER
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                     <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5 text-sm">
                       <span className="text-muted-foreground">Detection Layer</span>
                       <span className="font-mono text-emerald-400">{incident.detectionLayer}</span>
                     </div>
                     <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5 text-sm">
                       <span className="text-muted-foreground">Blocked Layer</span>
                       <span className="font-mono text-destructive">{incident.blockedLayer}</span>
                     </div>
                     <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5 text-sm">
                       <span className="text-muted-foreground">Affected Asset</span>
                       <span className="font-mono">{incident.affectedAsset}</span>
                     </div>
                     <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5 text-sm">
                       <span className="text-muted-foreground">Source</span>
                       <span className="font-mono text-amber-500">{incident.source}</span>
                     </div>
                   </div>

                   <div className="bg-black/60 border border-white/5 p-4 rounded-lg relative overflow-hidden">
                      <h4 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center">
                        <FileSearch className="w-4 h-4 mr-2" /> INVESTIGATION TIMELINE
                      </h4>
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-mono text-emerald-400">REQUEST RECEIVED</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-mono text-amber-500">THREAT DETECTED ({incident.detectionLayer})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                          <span className="text-xs font-mono text-destructive">BLOCKED ({incident.blockedLayer})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs font-mono text-primary">AUDIT RECORDED</span>
                        </div>
                        {incident.status === 'THREAT CONTAINED' && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-mono text-emerald-400">CONTAINMENT & RECOVERY COMPLETE</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute left-[23px] top-6 bottom-4 w-px bg-white/10 z-0" />
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
