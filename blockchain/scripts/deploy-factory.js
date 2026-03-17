const hre = require("hardhat");

async function main() {
  console.log("Deploying PropertyFactory...");

  // Get the contract blueprint
  const Factory = await hre.ethers.getContractFactory("PropertyFactory");
  
  // Deploy it
  const factory = await Factory.deploy();

  // Wait for it to be mined (ethers v6 syntax)
  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log(`✅ PropertyFactory deployed securely to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});