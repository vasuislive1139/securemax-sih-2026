import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Chain-2: Key Management Domain", function () {
  let keyPolicyManager: any;
  let keyLifecycle: any;
  let decryptionAuth: any;
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;

  const KEY1 = ethers.id("key1");
  const KEY2 = ethers.id("key2");
  const ASSET1 = ethers.id("asset1");
  const POLICY1 = ethers.id("policy1");
  const AUTH1 = ethers.id("auth1");
  const CONDITIONS_HASH = ethers.id("conditions");

  beforeEach(async function () {
    [owner, attacker] = await ethers.getSigners();

    const KeyPolicyManager = await ethers.getContractFactory("KeyPolicyManager");
    keyPolicyManager = await KeyPolicyManager.deploy();

    const KeyLifecycle = await ethers.getContractFactory("KeyLifecycle");
    keyLifecycle = await KeyLifecycle.deploy();

    const DecryptionAuth = await ethers.getContractFactory("DecryptionAuth");
    decryptionAuth = await DecryptionAuth.deploy();
  });

  describe("KeyLifecycle", function () {
    it("Should register a key identifier without storing raw key", async function () {
      await expect(keyLifecycle.registerKey(KEY1, ASSET1, 1, 1))
        .to.emit(keyLifecycle, "KeyRegistered")
        .withArgs(KEY1, ASSET1);

      const isActive = await keyLifecycle.isKeyActive(KEY1);
      expect(isActive).to.be.true;
    });

    it("Should successfully rotate a key and deactivate the old one", async function () {
      await keyLifecycle.registerKey(KEY1, ASSET1, 1, 1);
      await expect(keyLifecycle.rotateKey(KEY1, KEY2, 2))
        .to.emit(keyLifecycle, "KeyRotated")
        .withArgs(KEY1, KEY2);

      expect(await keyLifecycle.isKeyActive(KEY1)).to.be.false;
      expect(await keyLifecycle.isKeyActive(KEY2)).to.be.true;
    });

    it("Should permanently revoke a key", async function () {
      await keyLifecycle.registerKey(KEY1, ASSET1, 1, 1);
      await keyLifecycle.revokeKey(KEY1);
      expect(await keyLifecycle.isKeyActive(KEY1)).to.be.false;
    });

    it("Should prevent unauthorized actors from rotating keys", async function () {
      await keyLifecycle.registerKey(KEY1, ASSET1, 1, 1);
      await expect(
        keyLifecycle.connect(attacker).rotateKey(KEY1, KEY2, 2)
      ).to.be.revertedWithCustomError(keyLifecycle, "OwnableUnauthorizedAccount");
    });
  });

  describe("KeyPolicyManager", function () {
    it("Should create a policy correctly", async function () {
      await expect(keyPolicyManager.createPolicy(POLICY1, KEY1, 1, CONDITIONS_HASH))
        .to.emit(keyPolicyManager, "PolicyCreated")
        .withArgs(POLICY1, KEY1);

      expect(await keyPolicyManager.isPolicyActive(POLICY1)).to.be.true;
    });

    it("Should allow authorized deactivation of policies", async function () {
      await keyPolicyManager.createPolicy(POLICY1, KEY1, 1, CONDITIONS_HASH);
      await keyPolicyManager.deactivatePolicy(POLICY1);
      expect(await keyPolicyManager.isPolicyActive(POLICY1)).to.be.false;
    });

    it("Should prevent invalid state transitions (update on deactivated policy)", async function () {
      await keyPolicyManager.createPolicy(POLICY1, KEY1, 1, CONDITIONS_HASH);
      await keyPolicyManager.deactivatePolicy(POLICY1);
      
      await expect(
        keyPolicyManager.updatePolicy(POLICY1, ethers.id("new_conditions"))
      ).to.be.revertedWith("Policy is inactive");
    });
  });

  describe("DecryptionAuth", function () {
    it("Should record authorization events (Temporary Authorization)", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 300; // 5 mins
      await expect(decryptionAuth.recordAuthorization(AUTH1, "did:user", ASSET1, KEY1, expiresAt))
        .to.emit(decryptionAuth, "DecryptionAuthorized")
        .withArgs(AUTH1, "did:user", ASSET1);

      const auth = await decryptionAuth.getAuthorization(AUTH1);
      expect(auth.userDid).to.equal("did:user");
    });

    it("Should prevent authorization recording by unauthorized actors", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 300;
      await expect(
        decryptionAuth.connect(attacker).recordAuthorization(AUTH1, "did:user", ASSET1, KEY1, expiresAt)
      ).to.be.revertedWithCustomError(decryptionAuth, "OwnableUnauthorizedAccount");
    });

    it("Should record decryption denials", async function () {
      await expect(decryptionAuth.recordDenial(AUTH1, "did:attacker", ASSET1, "Policy mismatch"))
        .to.emit(decryptionAuth, "DecryptionDenied")
        .withArgs(AUTH1, "did:attacker", ASSET1, "Policy mismatch");
    });
  });
});
