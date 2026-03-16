import { ethers } from "hardhat";

async function main() {
  console.log("Preparing deployment to Polygon Amoy...");

  const propertyName = "Riverside Estate";
  const tokenSymbol = "RIV-EST";
  const databaseId = "4f5a3358-19f8-4904-ace5-ba07a1e689be"; // Paste your actual property_id here

  // Standard, fully-typed ethers import
  const PropertyShare = await ethers.getContractFactory("LuxePropertyShare");

  console.log(`Deploying ${propertyName} (${tokenSymbol})...`);

  const propertyShare = await PropertyShare.deploy(propertyName, tokenSymbol, databaseId, {
    gasLimit: 3000000 // Manually setting a cap can sometimes help
  });

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