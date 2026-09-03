import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";

async function main() {
  console.log("Deploying Chain-1 Contracts...");
  
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log("IdentityRegistry deployed to:", identityRegistryAddress);

  const RBACManager = await ethers.getContractFactory("RBACManager");
  const rbacManager = await RBACManager.deploy();
  await rbacManager.waitForDeployment();
  const rbacManagerAddress = await rbacManager.getAddress();
  console.log("RBACManager deployed to:", rbacManagerAddress);

  const AssetRegistry = await ethers.getContractFactory("AssetRegistry");
  const assetRegistry = await AssetRegistry.deploy();
  await assetRegistry.waitForDeployment();
  const assetRegistryAddress = await assetRegistry.getAddress();
  console.log("AssetRegistry deployed to:", assetRegistryAddress);

  const AuditAnchor = await ethers.getContractFactory("AuditAnchor");
  const auditAnchor = await AuditAnchor.deploy();
  await auditAnchor.waitForDeployment();
  const auditAnchorAddress = await auditAnchor.getAddress();
  console.log("AuditAnchor deployed to:", auditAnchorAddress);

  console.log("Deploying Chain-2 Contracts...");

  const KeyPolicyManager = await ethers.getContractFactory("KeyPolicyManager");
  const keyPolicyManager = await KeyPolicyManager.deploy();
  await keyPolicyManager.waitForDeployment();
  const keyPolicyManagerAddress = await keyPolicyManager.getAddress();
  console.log("KeyPolicyManager deployed to:", keyPolicyManagerAddress);

  const KeyLifecycle = await ethers.getContractFactory("KeyLifecycle");
  const keyLifecycle = await KeyLifecycle.deploy();
  await keyLifecycle.waitForDeployment();
  const keyLifecycleAddress = await keyLifecycle.getAddress();
  console.log("KeyLifecycle deployed to:", keyLifecycleAddress);

  const DecryptionAuth = await ethers.getContractFactory("DecryptionAuth");
  const decryptionAuth = await DecryptionAuth.deploy();
  await decryptionAuth.waitForDeployment();
  const decryptionAuthAddress = await decryptionAuth.getAddress();
  console.log("DecryptionAuth deployed to:", decryptionAuthAddress);

  const addresses = {
    chain1: {
      IdentityRegistry: identityRegistryAddress,
      RBACManager: rbacManagerAddress,
      AssetRegistry: assetRegistryAddress,
      AuditAnchor: auditAnchorAddress,
    },
    chain2: {
      KeyPolicyManager: keyPolicyManagerAddress,
      KeyLifecycle: keyLifecycleAddress,
      DecryptionAuth: decryptionAuthAddress,
    }
  };

  fs.writeFileSync("deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("Addresses saved to deployed-addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
