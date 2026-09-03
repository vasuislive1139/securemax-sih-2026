'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useBlockchainTransaction } from '@/hooks/useBlockchainTransaction';
import { AssetRegistryABI } from '@/lib/blockchain/abis';
import { keccak256, stringToHex } from 'viem';

export function AssignAssetButton({ assetId, assigneeDid }: { assetId: string, assigneeDid: string }) {
  const { execute, txState, errorMessage, hash } = useBlockchainTransaction();

  const handleAssign = () => {
    execute({
      address: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS as `0x${string}`,
      abi: AssetRegistryABI,
      functionName: 'assignAsset',
      args: [keccak256(stringToHex(assetId)), assigneeDid, 3], // 3 = read + decrypt permission
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleAssign} 
        disabled={txState === 'PREPARING' || txState === 'WALLET_CONFIRMATION_REQUIRED' || txState === 'SUBMITTED' || txState === 'CONFIRMING'}
        size="sm" 
        className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
      >
        <Key className="w-4 h-4 mr-2" /> 
        {txState === 'IDLE' ? 'Assign Access (Chain-1)' : txState}
      </Button>
      {hash && <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">Tx: {hash}</span>}
      {errorMessage && <span className="text-xs text-destructive">{errorMessage}</span>}
    </div>
  );
}
