const hre = require("hardhat");

async function main() {
  console.log("Preparing deployment to Polygon Amoy...");

  // These parameters will be hardcoded in the smart contract forever
  // In production, you would pass these dynamically via a script argument
  const propertyName = "Luxe Kilimani Heights";
  const tokenSymbol = "LUX-KIL";
  const databaseId = "db-uuid-from-supabase-here"; // The property_id from your DB

  // 1. Get the Contract Factory
  const PropertyShare = await hre.ethers.getContractFactory("LuxePropertyShare");

  console.log(`Deploying ${propertyName} (${tokenSymbol})...`);

  // 2. Deploy the contract with constructor arguments
  const propertyShare = await PropertyShare.deploy(propertyName, tokenSymbol, databaseId);

  // 3. Wait for the transaction to be mined (Ethers v6 syntax)
  await propertyShare.waitForDeployment();

  const contractAddress = await propertyShare.getAddress();
  
  console.log("\n✅ Deployment Successful!");
  console.log("-----------------------------------------");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Property DB ID: ${databaseId}`);
  console.log("-----------------------------------------");
  
  console.log("\nNext Steps:");
  console.log(`1. Copy ${contractAddress} and paste it into the 'smart_contract_address' column in your Supabase 'property_shares' table.`);
  console.log(`2. Verify your contract on Polygonscan by running:`);
  console.log(`npx hardhat verify --network amoy ${contractAddress} "${propertyName}" "${tokenSymbol}" "${databaseId}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});