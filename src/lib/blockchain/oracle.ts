import 'server-only';
import { createPublicClient, http, keccak256, toHex, stringToHex } from 'viem';
import { sepolia, hardhat } from 'viem/chains';
import { AssetRegistryABI, KeyLifecycleABI } from './abis';

export type OracleResult = {
  allowed: boolean;
  status: 'AUTHORIZED' | 'DENIED' | 'UNAVAILABLE' | 'ERROR' | 'CONFIG_ERROR';
  chainId: number;
  contractAddress?: string;
  reason?: string;
};

// Select chain based on env
const targetChain = process.env.NODE_ENV === 'production' ? sepolia : hardhat;
const rpcUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL || 'http://127.0.0.1:8545';

const publicClient = createPublicClient({
  chain: targetChain,
  transport: http(rpcUrl),
});

/**
 * Validates Identity and Asset Assignment against Blockchain-1.
 * Strict Fail-Closed implementation.
 */
export async function verifyChain1Access(userId: string, assetId: string): Promise<OracleResult> {
  const contractAddress = process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS as `0x${string}`;
  if (!contractAddress) {
    return { allowed: false, status: 'CONFIG_ERROR', chainId: targetChain.id, reason: 'AssetRegistry address not configured' };
  }

  try {
    // Hash the assetId (string) into a bytes32 identifier required by the smart contract
    const assetIdBytes32 = keccak256(stringToHex(assetId));
    
    // In our prototype, userId maps to assigneeDid
    const isAssigned = await publicClient.readContract({
      address: contractAddress,
      abi: AssetRegistryABI,
      functionName: 'isAssigned',
      args: [assetIdBytes32, userId],
    });

    if (isAssigned) {
      return { allowed: true, status: 'AUTHORIZED', chainId: targetChain.id, contractAddress };
    } else {
      return { allowed: false, status: 'DENIED', chainId: targetChain.id, contractAddress, reason: 'No active assignment found on Chain-1' };
    }
  } catch (error: any) {
    console.error('Chain 1 Oracle Error:', error.message);
    return { allowed: false, status: 'UNAVAILABLE', chainId: targetChain.id, contractAddress, reason: 'RPC Failure or Contract Revert' };
  }
}

/**
 * Validates Key Policies against Blockchain-2.
 * Strict Fail-Closed implementation.
 */
export async function verifyChain2Policy(assetId: string): Promise<OracleResult> {
  const contractAddress = process.env.NEXT_PUBLIC_KEY_LIFECYCLE_ADDRESS as `0x${string}`;
  if (!contractAddress) {
    return { allowed: false, status: 'CONFIG_ERROR', chainId: targetChain.id, reason: 'KeyLifecycle address not configured' };
  }

  try {
    // Map assetId to the corresponding KeyId (usually a 1-to-1 in our prototype)
    const keyIdBytes32 = keccak256(stringToHex(assetId));

    const isKeyActive = await publicClient.readContract({
      address: contractAddress,
      abi: KeyLifecycleABI,
      functionName: 'isKeyActive',
      args: [keyIdBytes32],
    });

    if (isKeyActive) {
      return { allowed: true, status: 'AUTHORIZED', chainId: targetChain.id, contractAddress };
    } else {
      return { allowed: false, status: 'DENIED', chainId: targetChain.id, contractAddress, reason: 'Key is revoked or inactive on Chain-2' };
    }
  } catch (error: any) {
    console.error('Chain 2 Oracle Error:', error.message);
    return { allowed: false, status: 'UNAVAILABLE', chainId: targetChain.id, contractAddress, reason: 'RPC Failure or Contract Revert' };
  }
}
