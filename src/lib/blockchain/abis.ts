export const AssetRegistryABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "assetId", "type": "bytes32" }],
    "name": "getAsset",
    "outputs": [{
      "components": [
        { "internalType": "bytes32", "name": "assetId", "type": "bytes32" },
        { "internalType": "string", "name": "assetCode", "type": "string" },
        { "internalType": "bytes32", "name": "contentHash", "type": "bytes32" },
        { "internalType": "uint8", "name": "classification", "type": "uint8" },
        { "internalType": "string", "name": "ownerDid", "type": "string" },
        { "internalType": "uint8", "name": "status", "type": "uint8" },
        { "internalType": "uint256", "name": "registeredAt", "type": "uint256" }
      ],
      "internalType": "struct AssetRegistry.Asset",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "assetId", "type": "bytes32" },
      { "internalType": "string", "name": "assigneeDid", "type": "string" }
    ],
    "name": "isAssigned",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "assetId", "type": "bytes32" },
      { "internalType": "string", "name": "assigneeDid", "type": "string" },
      { "internalType": "uint8", "name": "permissions", "type": "uint8" }
    ],
    "name": "assignAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const KeyLifecycleABI = [
  {
    "inputs": [{ "internalType": "bytes32", "name": "keyId", "type": "bytes32" }],
    "name": "isKeyActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];
