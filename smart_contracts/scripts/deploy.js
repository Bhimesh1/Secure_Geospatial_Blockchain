// deploy.js
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const GeoDataStorage = await hre.ethers.getContractFactory("GeoDataStorage");

  // Deploy the contract
  const geoDataStorage = await GeoDataStorage.deploy();

  // Wait for deployment
  await geoDataStorage.deployed();

  console.log("GeoDataStorage deployed to:", geoDataStorage.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });