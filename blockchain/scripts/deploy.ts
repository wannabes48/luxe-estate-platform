import { ethers } from "hardhat";

async function main() {
  console.log("Preparing deployment to Polygon Amoy...");

  const propertyName = "Luxe Kilimani Heights";
  const tokenSymbol = "LUX-KIL";
  const databaseId = "db-uuid-from-supabase-here"; // The property_id from your DB

  // 1. Get the Contract Factory
  const PropertyShare = await ethers.getContractFactory("LuxePropertyShare");

  console.log(`Deploying ${propertyName} (${tokenSymbol})...`);

  // 2. Deploy the contract with constructor arguments
  const propertyShare = await PropertyShare.deploy(propertyName, tokenSymbol, databaseId);

  // 3. Wait for the transaction to be mined
  await propertyShare.waitForDeployment();

  const contractAddress = await propertyShare.getAddress();
  
  console.log("\n✅ Deployment Successful!");
  console.log("-----------------------------------------");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Property DB ID: ${databaseId}`);
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});