'use client';

import * as React from 'react';
import { HardDrive, Plus, Lock, Unlock, FileText, Search, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AssetsPage() {
  // Mock data for prototype UI
  const mockAssets = [
    { id: '1', code: 'BEL-RDR-001', name: 'Radar Signal Processing Spec', class: 'HIGH', status: 'ACTIVE', owner: '0x1111...1111', date: '2026-09-03' },
    { id: '2', code: 'BEL-EW-002', name: 'Electronic Warfare Test Proc', class: 'RESTRICTED', status: 'ACTIVE', owner: '0x2222...2222', date: '2026-09-02' },
    { id: '3', code: 'BEL-AVI-003', name: 'Secure Avionics Interface', class: 'HIGH', status: 'ACTIVE', owner: '0x1111...1111', date: '2026-09-01' },
    { id: '4', code: 'BEL-CYB-004', name: 'Cyber Incident Response', class: 'CONFIDENTIAL', status: 'ACTIVE', owner: '0x5555...5555', date: '2026-08-28' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Digital Assets</h2>
          <p className="text-muted-foreground">Manage and request access to encrypted assets.</p>
        </div>
        <Button className="mt-4 sm:mt-0" variant="mesh">
          <Plus className="mr-2 h-4 w-4" />
          Register New Asset
        </Button>
      </div>

      <Card className="">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets by code or name..."
                className="pl-8 bg-background/50"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Asset Code & Name</th>
                  <th className="px-6 py-3 font-medium">Classification</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Owner DID</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-3 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">{asset.code}</div>
                          <div className="text-xs text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={asset.class === 'HIGH' || asset.class === 'RESTRICTED' ? 'critical' : 'confidential'}>
                        {asset.class}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="active" className="text-[10px]">
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {asset.owner}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm">
                        <Lock className="h-3 w-3 mr-1" />
                        Request Access
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
