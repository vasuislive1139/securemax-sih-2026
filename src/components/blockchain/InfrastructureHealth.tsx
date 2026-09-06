'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';
import { useDemoStore } from '@/stores/useDemoStore';
import { useBlockNumber, usePublicClient } from 'wagmi';

const CONTRACTS = {
  IdentityRegistry: "0xb2Ad55fD06552E47E4304e3A48AACDdde33808d0",
  RBACManager: "0x9b4B628653b0Aa4dAAeccC17273b287e875C61DF",
  AssetRegistry: "0x41652715d743C7f9740b83526B09994e60aa61B6",
  AuditAnchor: "0xE0f14367d09812f624DCF634d388d6D06d712688",
  KeyPolicyManager: "0xE31a493DF191fD0fD88c99820d0AfCCEC5F13f80",
  KeyLifecycle: "0xBd088a9cd06f59aDaB56202F335EfC300614f743",
  DecryptionAuth: "0x65d897450295189230bb49C2b4D83c904A36Fc07"
};

export function InfrastructureHealth() {
  const { systemState } = useDemoStore();
  const isHealthy = systemState !== 'CONTAINMENT';
  const { data: blockNumber, isError } = useBlockNumber({ watch: true });
  const client = usePublicClient();
  const [bytecodeStatus, setBytecodeStatus] = useState<Record<string, boolean>>({});
  const chainId = client?.chain?.id;

  useEffect(() => {
    if (!client) return;
    const checkBytecode = async () => {
      // Only verify if we are correctly targeting Sepolia (Chain ID 11155111)
      if (client.chain?.id !== 11155111) {
        setBytecodeStatus({});
        return;
      }
      const statuses: Record<string, boolean> = {};
      for (const [name, address] of Object.entries(CONTRACTS)) {
        try {
          const code = await client.getBytecode({ address: address as `0x${string}` });
          statuses[name] = code !== undefined && code !== '0x';
        } catch {
          statuses[name] = false;
        }
      }
      setBytecodeStatus(statuses);
    };
    checkBytecode();
  }, [client]);

  return (
    <Card className="bg-[#0a0a0c] border-zinc-800 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" /> Infrastructure Health
        </CardTitle>
        <CardDescription>Logical Security Domains on Ethereum Sepolia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between p-3 rounded-md bg-black/40 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isHealthy && !isError && chainId === 11155111 ? 'bg-emerald-500 animate-pulse' : 'bg-destructive animate-pulse'}`} />
            <div>
              <p className="text-sm font-medium leading-none">Ethereum Sepolia</p>
              <p className="text-xs text-muted-foreground mt-1">Chain ID: {chainId || 'UNKNOWN'} {blockNumber && `• Block: ${blockNumber}`}</p>
            </div>
          </div>
          <Badge variant="outline" className={`font-mono text-[10px] ${isHealthy && !isError && chainId === 11155111 ? 'text-emerald-400 border-emerald-500/30' : 'text-destructive border-destructive/30'}`}>
            {isHealthy && !isError && chainId === 11155111 ? 'RPC ACTIVE' : 'WRONG NETWORK'}
          </Badge>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DOMAIN 1: IDENTITY & ASSET POLICY</h4>
          <div className="grid grid-cols-2 gap-2">
            <ContractStatus name="IdentityRegistry" hasBytecode={bytecodeStatus['IdentityRegistry']} healthy={isHealthy} />
            <ContractStatus name="RBACManager" hasBytecode={bytecodeStatus['RBACManager']} healthy={isHealthy} />
            <ContractStatus name="AssetRegistry" hasBytecode={bytecodeStatus['AssetRegistry']} healthy={isHealthy} />
            <ContractStatus name="AuditAnchor" hasBytecode={bytecodeStatus['AuditAnchor']} healthy={isHealthy} />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DOMAIN 2: KEY & DECRYPTION POLICY</h4>
          <div className="grid grid-cols-2 gap-2">
            <ContractStatus name="KeyPolicyManager" hasBytecode={bytecodeStatus['KeyPolicyManager']} healthy={isHealthy} />
            <ContractStatus name="KeyLifecycle" hasBytecode={bytecodeStatus['KeyLifecycle']} healthy={isHealthy} />
            <ContractStatus name="DecryptionAuth" hasBytecode={bytecodeStatus['DecryptionAuth']} healthy={isHealthy} />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function ContractStatus({ name, hasBytecode, healthy }: { name: string, hasBytecode?: boolean, healthy: boolean }) {
  const isOk = healthy && hasBytecode;
  return (
    <div className="flex flex-col p-2 rounded bg-black/20 border border-zinc-800 gap-1">
      <span className="text-[11px] font-medium text-foreground">{name}</span>
      <span className={`text-[9px] font-mono ${isOk ? 'text-emerald-500/80' : hasBytecode === false ? 'text-amber-500/80' : 'text-zinc-500/80'}`}>
        {isOk ? 'OK — BYTECODE PRESENT' : hasBytecode === false ? 'NOT DEPLOYED' : 'CHECKING...'}
      </span>
    </div>
  );
}
