'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useBlockchainTransaction } from '@/hooks/useBlockchainTransaction';
import { AssetRegistryABI } from '@/lib/blockchain/abis';
import { keccak256, stringToHex } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

export function AssignAssetButton({ assetId, assigneeDid }: { assetId: string, assigneeDid: string }) {
  const { execute, txState, errorMessage, hash } = useBlockchainTransaction();
  const { address } = useAccount();

  const { data: owner, isLoading: ownerLoading } = useReadContract({
    address: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS as `0x${string}`,
    abi: AssetRegistryABI,
    functionName: 'owner',
  });

  const { data: assetData, isLoading: assetLoading } = useReadContract({
    address: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS as `0x${string}`,
    abi: AssetRegistryABI,
    functionName: 'getAsset',
    args: [keccak256(stringToHex(assetId))]
  });

  const isOwner = Boolean(address && owner && (address as string).toLowerCase() === (owner as string).toLowerCase());
  const isRegistered = Boolean(assetData && (assetData as any).registeredAt > 0n);
  const checksLoaded = !ownerLoading && !assetLoading && Boolean(owner);

  const handleAssign = () => {
    execute({
      address: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS as `0x${string}`,
      abi: AssetRegistryABI,
      functionName: 'assignAsset',
      args: [keccak256(stringToHex(assetId)), assigneeDid, 3], // 3 = read + decrypt permission
    });
  };

  const getButtonText = () => {
    if (txState !== 'IDLE') return txState;
    if (checksLoaded && !isOwner) return 'Unauthorized';
    if (checksLoaded && !isRegistered) return 'Asset Not Found';
    return 'Assign Access (Domain 1)';
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleAssign} 
        disabled={(!isOwner || !isRegistered) || txState === 'PREPARING' || txState === 'WALLET_CONFIRMATION_REQUIRED' || txState === 'SUBMITTED' || txState === 'CONFIRMING'}
        size="sm" 
        className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
      >
        <Key className="w-4 h-4 mr-2" /> 
        {getButtonText()}
      </Button>
      {hash && <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">Tx: {hash}</span>}
      {(checksLoaded && !isOwner) && <span className="text-[10px] text-amber-500 font-mono">Pre-flight check failed: Caller is not the contract owner. Action blocked.</span>}
      {(checksLoaded && isOwner && !isRegistered) && <span className="text-[10px] text-amber-500 font-mono">Pre-flight check failed: Asset &quot;{assetId}&quot; is not registered on Sepolia. Action blocked to prevent revert.</span>}
      {errorMessage && <span className="text-[10px] text-destructive font-mono">{errorMessage}</span>}
    </div>
  );
}
