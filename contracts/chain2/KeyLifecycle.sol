// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ISecureMesh.sol";

contract KeyLifecycle is Ownable {
    struct KeyMetadata {
        bytes32 keyId;
        bytes32 assetId;
        uint256 version;
        ISecureMesh.KeyState status;
        uint8 algorithm;
        uint256 createdAt;
        uint256 rotatedAt;
        uint256 revokedAt;
    }

    mapping(bytes32 => KeyMetadata) private keys;

    event KeyRegistered(bytes32 indexed keyId, bytes32 indexed assetId);
    event KeyRotated(bytes32 indexed oldKeyId, bytes32 indexed newKeyId);
    event KeyRevoked(bytes32 indexed keyId);

    constructor() Ownable(msg.sender) {}

    function registerKey(bytes32 keyId, bytes32 assetId, uint256 version, uint8 algorithm) external onlyOwner {
        require(keys[keyId].createdAt == 0, "Key already exists");
        keys[keyId] = KeyMetadata({
            keyId: keyId,
            assetId: assetId,
            version: version,
            status: ISecureMesh.KeyState.Active,
            algorithm: algorithm,
            createdAt: block.timestamp,
            rotatedAt: 0,
            revokedAt: 0
        });
        emit KeyRegistered(keyId, assetId);
    }

    function rotateKey(bytes32 oldKeyId, bytes32 newKeyId, uint256 newVersion) external onlyOwner {
        require(keys[oldKeyId].createdAt != 0, "Old key not found");
        require(keys[oldKeyId].status == ISecureMesh.KeyState.Active, "Old key not active");
        require(keys[newKeyId].createdAt == 0, "New key already exists");
        
        keys[oldKeyId].status = ISecureMesh.KeyState.Rotated;
        keys[oldKeyId].rotatedAt = block.timestamp;
        
        keys[newKeyId] = KeyMetadata({
            keyId: newKeyId,
            assetId: keys[oldKeyId].assetId,
            version: newVersion,
            status: ISecureMesh.KeyState.Active,
            algorithm: keys[oldKeyId].algorithm,
            createdAt: block.timestamp,
            rotatedAt: 0,
            revokedAt: 0
        });
        
        emit KeyRotated(oldKeyId, newKeyId);
    }

    function revokeKey(bytes32 keyId) external onlyOwner {
        require(keys[keyId].createdAt != 0, "Key not found");
        require(keys[keyId].status == ISecureMesh.KeyState.Active || keys[keyId].status == ISecureMesh.KeyState.Rotated, "Invalid state for revocation");
        
        keys[keyId].status = ISecureMesh.KeyState.Revoked;
        keys[keyId].revokedAt = block.timestamp;
        
        emit KeyRevoked(keyId);
    }

    function getKeyMetadata(bytes32 keyId) external view returns (KeyMetadata memory) {
        return keys[keyId];
    }

    function isKeyActive(bytes32 keyId) external view returns (bool) {
        return keys[keyId].status == ISecureMesh.KeyState.Active;
    }
}
