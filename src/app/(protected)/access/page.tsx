'use client';

import * as React from 'react';
import { Key, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AccessRequestsPage() {
  // Mock data for prototype UI
  const mockRequests = [
    { id: '1', assetCode: 'BEL-RDR-001', requester: '0x3333...3333 (ENGINEER)', purpose: 'Maintenance and analysis', status: 'PENDING', date: '10 mins ago' },
    { id: '2', assetCode: 'BEL-EW-002', requester: '0x4444...4444 (AUDITOR)', purpose: 'Quarterly compliance review', status: 'AUTHORIZED', date: '2 hours ago' },
    { id: '3', assetCode: 'BEL-AVI-003', requester: '0x5555...5555 (ANALYST)', purpose: 'Vulnerability assessment', status: 'DENIED', date: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Access Requests</h2>
        <p className="text-muted-foreground">Manage authorization to decryption keys (Domain 2).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {mockRequests.map((req) => (
          <Card key={req.id} className=" relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              req.status === 'PENDING' ? 'bg-amber-500' :
              req.status === 'AUTHORIZED' ? 'bg-emerald-500' : 'bg-red-500'
            }`} />
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant={
                  req.status === 'PENDING' ? 'pending' :
                  req.status === 'AUTHORIZED' ? 'active' : 'denied'
                }>
                  {req.status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                  {req.status === 'AUTHORIZED' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {req.status === 'DENIED' && <XCircle className="h-3 w-3 mr-1" />}
                  {req.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{req.date}</span>
              </div>
              <CardTitle className="mt-2">{req.assetCode}</CardTitle>
              <CardDescription className="text-xs">
                <span className="font-semibold text-foreground">Req:</span> {req.requester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 rounded p-3 mb-4 text-sm border border-border">
                <span className="text-muted-foreground text-xs block mb-1">Purpose:</span>
                {req.purpose}
              </div>
              
              {req.status === 'PENDING' && (
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" size="sm">
                    Deny
                  </Button>
                </div>
              )}
              
              {req.status === 'AUTHORIZED' && (
                <Button className="w-full" variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  View Decryption Token
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
