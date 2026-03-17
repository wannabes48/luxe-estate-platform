// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 1. The Blueprint for individual properties
contract PropertyToken is ERC20, Ownable {
    uint256 public pricePerShare;
    string public propertyId; // Links back to your Supabase UUID

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalShares,
        uint256 _pricePerShare,
        string memory _propertyId,
        address adminAddress
    ) ERC20(name, symbol) Ownable(adminAddress) {
        pricePerShare = _pricePerShare;
        propertyId = _propertyId;
        
        // Mint all shares to the admin initially. 
        // They will be distributed to investors later.
        _mint(adminAddress, totalShares * 10 ** decimals());
    }
}

// 2. The Factory that deploys the blueprints
contract PropertyFactory is Ownable {
    // Keep a record of all deployed properties
    mapping(string => address) public deployedProperties;
    address[] public allProperties;

    event PropertyDeployed(string propertyId, address contractAddress, uint256 totalShares);

    constructor() Ownable(msg.sender) {}

    function deployProperty(
        string memory name,
        string memory symbol,
        uint256 totalShares,
        uint256 pricePerShare,
        string memory propertyId
    ) external onlyOwner returns (address) {
        require(deployedProperties[propertyId] == address(0), "Property already tokenized");

        // Deploy the new token contract
        PropertyToken newToken = new PropertyToken(
            name,
            symbol,
            totalShares,
            pricePerShare,
            propertyId,
            msg.sender // The admin calling the factory becomes the owner
        );

        address newContractAddress = address(newToken);
        
        // Save to our on-chain ledger
        deployedProperties[propertyId] = newContractAddress;
        allProperties.push(newContractAddress);

        // Announce the new address to the blockchain (Next.js will listen for this)
        emit PropertyDeployed(propertyId, newContractAddress, totalShares);

        return newContractAddress;
    }
}