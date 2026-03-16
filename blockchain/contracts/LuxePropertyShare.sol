// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LuxePropertyShare is ERC20, Ownable {
    uint256 public constant MAX_SHARES = 1000;
    uint256 public sharesMinted = 0;
    string public propertyDatabaseId; // Links back to Supabase property_id

    // Events for transparency
    event SharesPurchased(address indexed investor, uint256 amount);
    event DividendDistributed(uint256 totalAmount);

    constructor(
        string memory _propertyName, 
        string memory _propertySymbol,
        string memory _dbId
    ) ERC20(_propertyName, _propertySymbol) Ownable(msg.sender) {
        propertyDatabaseId = _dbId;
    }

    // Only the Luxe Estate Admin wallet can mint tokens after M-Pesa payment clears
    function mintShares(address investor, uint256 amount) external onlyOwner {
        require(sharesMinted + amount <= MAX_SHARES, "Exceeds maximum property shares");
        
        sharesMinted += amount;
        
        // Minting whole tokens (1 token = 1 share). 
        // Adjust decimals if you want fractional shares of a share.
        _mint(investor, amount * 10 ** decimals()); 
        
        emit SharesPurchased(investor, amount);
    }

    // Admin function to distribute rental yield directly to token holders
    // Requires a snapshot mechanism or a distributor contract in production
    receive() external payable {
        emit DividendDistributed(msg.value);
    }
}