export const AssetRegistryABI = [
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
