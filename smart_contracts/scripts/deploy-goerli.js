const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Get the contract factory
  const GeoDataStorage = await hre.ethers.getContractFactory("GeoDataStorage");

  // Deploy the contract
  console.log("Deploying GeoDataStorage to Goerli test network...");
  const geoDataStorage = await GeoDataStorage.deploy();

  // Wait for deployment
  await geoDataStorage.deployed();

  console.log("GeoDataStorage deployed to:", geoDataStorage.address);

  // Save the contract address to a file
  fs.writeFileSync(
    'contract-address.txt',
    `Contract deployed to: ${geoDataStorage.address}\nNetwork: ${hre.network.name}\nTimestamp: ${new Date().toISOString()}`
  );
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });