import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Chain-1: Identity & Access Domain", function () {
  let identityRegistry: any;
  let rbacManager: any;
  let assetRegistry: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let attacker: SignerWithAddress;

  const DID1 = "did:securemax:0x111";
  const DID2 = "did:securemax:0x222";
  const ASSET1 = ethers.id("asset1");
  const ASSET_CODE = "BEL-RDR-001";
  const CONTENT_HASH = ethers.id("content1");

  beforeEach(async function () {
    [owner, user1, user2, attacker] = await ethers.getSigners();

    // Deploy IdentityRegistry
    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    identityRegistry = await IdentityRegistry.deploy();

    // Deploy RBACManager
    const RBACManager = await ethers.getContractFactory("RBACManager");
    rbacManager = await RBACManager.deploy();

    // Deploy AssetRegistry
    const AssetRegistry = await ethers.getContractFactory("AssetRegistry");
    assetRegistry = await AssetRegistry.deploy();
  });

  describe("IdentityRegistry", function () {
    it("Should register an identity successfully", async function () {
      await expect(identityRegistry.registerIdentity(user1.address, DID1, ethers.id("Alice"), 2))
        .to.emit(identityRegistry, "IdentityRegistered")
        .withArgs(DID1, user1.address, 2);

      const isActive = await identityRegistry.isActive(DID1);
      expect(isActive).to.be.true;
    });

    it("Should prevent unauthorized users from registering identities", async function () {
      await expect(
        identityRegistry.connect(attacker).registerIdentity(attacker.address, "did:attacker", ethers.id("Attacker"), 2)
      ).to.be.revertedWithCustomError(identityRegistry, "OwnableUnauthorizedAccount");
    });

    it("Should update identity status properly", async function () {
      await identityRegistry.registerIdentity(user1.address, DID1, ethers.id("Alice"), 2);
      await expect(identityRegistry.updateStatus(DID1, 2)) // Suspended = 2
        .to.emit(identityRegistry, "IdentityStatusChanged")
        .withArgs(DID1, 2);

      const isActive = await identityRegistry.isActive(DID1);
      expect(isActive).to.be.false;
    });
  });

  describe("RBACManager", function () {
    it("Should assign and verify permissions correctly", async function () {
      const READ_PERMISSION = 1; // 0001
      const DECRYPT_PERMISSION = 2; // 0010

      await rbacManager.assignRole(DID1, 3, READ_PERMISSION | DECRYPT_PERMISSION);
      
      expect(await rbacManager.hasPermission(DID1, READ_PERMISSION)).to.be.true;
      expect(await rbacManager.hasPermission(DID1, DECRYPT_PERMISSION)).to.be.true;
    });

    it("Should fail permission check for revoked roles", async function () {
      const READ_PERMISSION = 1;
      await rbacManager.assignRole(DID1, 3, READ_PERMISSION);
      await rbacManager.revokeRole(DID1);
      
      expect(await rbacManager.hasPermission(DID1, READ_PERMISSION)).to.be.false;
    });

    it("Should prevent role escalation attempts", async function () {
      await expect(
        rbacManager.connect(attacker).assignRole(DID1, 1, 999) // Admin role = 1
      ).to.be.revertedWithCustomError(rbacManager, "OwnableUnauthorizedAccount");
    });
  });

  describe("AssetRegistry", function () {
    beforeEach(async function () {
      await assetRegistry.registerAsset(ASSET1, ASSET_CODE, CONTENT_HASH, 3, DID1);
    });

    it("Should register an asset", async function () {
      const asset = await assetRegistry.getAsset(ASSET1);
      expect(asset.assetCode).to.equal(ASSET_CODE);
      expect(asset.ownerDid).to.equal(DID1);
    });

    it("Should allow authorized ownership transfer", async function () {
      await expect(assetRegistry.transferAssetOwnership(ASSET1, DID2))
        .to.emit(assetRegistry, "AssetOwnershipTransferred")
        .withArgs(ASSET1, DID2);

      const asset = await assetRegistry.getAsset(ASSET1);
      expect(asset.ownerDid).to.equal(DID2);
    });

    it("Should prevent unauthorized ownership transfer", async function () {
      await expect(
        assetRegistry.connect(attacker).transferAssetOwnership(ASSET1, "did:attacker")
      ).to.be.revertedWithCustomError(assetRegistry, "OwnableUnauthorizedAccount");
    });

    it("Should assign and revoke asset access correctly", async function () {
      const PERM_READ = 1;
      await assetRegistry.assignAsset(ASSET1, DID2, PERM_READ);
      expect(await assetRegistry.isAssigned(ASSET1, DID2)).to.be.true;

      await assetRegistry.revokeAssignment(ASSET1, DID2);
      expect(await assetRegistry.isAssigned(ASSET1, DID2)).to.be.false;
    });

    it("Should prevent unauthorized assignment", async function () {
      await expect(
        assetRegistry.connect(attacker).assignAsset(ASSET1, "did:attacker", 1)
      ).to.be.revertedWithCustomError(assetRegistry, "OwnableUnauthorizedAccount");
    });
  });
});
