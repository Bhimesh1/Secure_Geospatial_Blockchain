// store_hash.js
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const GeoDataStorage = await hre.ethers.getContractFactory("GeoDataStorage");

  // The address where the contract is deployed (replace with your actual address)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Connect to the deployed contract
  const geoDataStorage = GeoDataStorage.attach(contractAddress);

  // Data to store
  const dataId = "geo-data-" + Date.now();
  const cipherHash = "0x123456789abcdef123456789abcdef123456789abcdef";
  const metadataHash = "0xabcdef123456789abcdef123456789abcdef123456";

  // Store data on the blockchain
  const tx = await geoDataStorage.storeData(dataId, cipherHash, metadataHash);
  await tx.wait();

  console.log(`Data stored successfully with ID: ${dataId}`);
  console.log("Transaction hash:", tx.hash);

  // Retrieve the stored data
  const result = await geoDataStorage.retrieveData(dataId);
  console.log("Retrieved data:");
  console.log("Cipher Hash:", result[0]);
  console.log("Metadata Hash:", result[1]);
  console.log("Timestamp:", new Date(result[2] * 1000).toISOString());
  console.log("Owner:", result[3]);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });