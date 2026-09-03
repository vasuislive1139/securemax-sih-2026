import { ethers, Contract, Provider, Signer } from "ethers";

// ABIs
const IdentityRegistryABI = [
  "function registerIdentity(address _owner, string memory did, bytes32 nameHash, uint8 role) external",
  "function updateStatus(string memory did, uint8 status) external",
  "function updateRole(string memory did, uint8 role) external",
  "function getIdentity(string memory did) external view returns (tuple(address owner, string did, bytes32 nameHash, uint8 role, uint8 status, uint256 registeredAt, uint256 updatedAt))",
  "function isActive(string memory did) external view returns (bool)"
];

const RBACManagerABI = [
  "function assignRole(string memory did, uint8 role, uint256 permissions) external",
  "function revokeRole(string memory did) external",
  "function hasPermission(string memory did, uint256 permissionBit) external view returns (bool)",
  "function getRole(string memory did) external view returns (tuple(string did, uint8 role, uint256 permissions, uint256 assignedAt, bool isActive))"
];

const AssetRegistryABI = [
  "function registerAsset(bytes32 assetId, string memory assetCode, bytes32 contentHash, uint8 classification, string memory ownerDid) external",
  "function assignAsset(bytes32 assetId, string memory assigneeDid, uint8 permissions) external",
  "function revokeAssignment(bytes32 assetId, string memory assigneeDid) external",
  "function transferOwnership(bytes32 assetId, string memory newOwnerDid) external",
  "function getAsset(bytes32 assetId) external view returns (tuple(bytes32 assetId, string assetCode, bytes32 contentHash, uint8 classification, string ownerDid, uint8 status, uint256 registeredAt))",
  "function getAssignment(bytes32 assetId, string memory assigneeDid) external view returns (tuple(bytes32 assetId, string assigneeDid, uint8 permissions, bool isActive, uint256 assignedAt, uint256 revokedAt))",
  "function isAssigned(bytes32 assetId, string memory assigneeDid) external view returns (bool)"
];

const AuditAnchorABI = [
  "function anchorMerkleRoot(uint256 batchStartId, uint256 batchEndId, bytes32 merkleRoot) external",
  "function getAnchor(uint256 index) external view returns (tuple(uint256 batchStartId, uint256 batchEndId, bytes32 merkleRoot, uint256 anchoredAt))",
  "function getLatestAnchor() external view returns (tuple(uint256 batchStartId, uint256 batchEndId, bytes32 merkleRoot, uint256 anchoredAt))",
  "function getAnchorCount() external view returns (uint256)"
];

export function getIdentityRegistryContract(providerOrSigner: Provider | Signer): Contract {
  const address = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS;
  if (!address) throw new Error("NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS not set");
  return new Contract(address, IdentityRegistryABI, providerOrSigner);
}

export function getRBACManagerContract(providerOrSigner: Provider | Signer): Contract {
  const address = process.env.NEXT_PUBLIC_RBAC_MANAGER_ADDRESS;
  if (!address) throw new Error("NEXT_PUBLIC_RBAC_MANAGER_ADDRESS not set");
  return new Contract(address, RBACManagerABI, providerOrSigner);
}

export function getAssetRegistryContract(providerOrSigner: Provider | Signer): Contract {
  const address = process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS;
  if (!address) throw new Error("NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS not set");
  return new Contract(address, AssetRegistryABI, providerOrSigner);
}

export function getAuditAnchorContract(providerOrSigner: Provider | Signer): Contract {
  const address = process.env.NEXT_PUBLIC_AUDIT_ANCHOR_ADDRESS;
  if (!address) throw new Error("NEXT_PUBLIC_AUDIT_ANCHOR_ADDRESS not set");
  return new Contract(address, AuditAnchorABI, providerOrSigner);
}
