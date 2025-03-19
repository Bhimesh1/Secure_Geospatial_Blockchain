const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GeoDataStorage", function () {
  let GeoDataStorage;
  let geoDataStorage;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    GeoDataStorage = await ethers.getContractFactory("GeoDataStorage");
    geoDataStorage = await GeoDataStorage.deploy();
    await geoDataStorage.deployed();
  });

  describe("Data Storage", function () {
    it("Should store data with correct values", async function () {
      const dataId = "test-data-1";
      const cipherHash = "0x1234567890abcdef";
      const metadataHash = "0xabcdef1234567890";

      // Store data
      await geoDataStorage.storeData(dataId, cipherHash, metadataHash);

      // Retrieve data
      const result = await geoDataStorage.retrieveData(dataId);

      expect(result[0]).to.equal(cipherHash);
      expect(result[1]).to.equal(metadataHash);
      expect(result[3]).to.equal(owner.address);
    });

    it("Should not allow storing data with existing ID", async function () {
      const dataId = "test-data-2";
      const cipherHash = "0x1234567890abcdef";
      const metadataHash = "0xabcdef1234567890";

      // Store data first time
      await geoDataStorage.storeData(dataId, cipherHash, metadataHash);

      // Try to store again with same ID
      await expect(
        geoDataStorage.storeData(dataId, cipherHash, metadataHash)
      ).to.be.revertedWith("Data ID already exists");
    });
  });

  describe("Access Control", function () {
    const dataId = "test-data-3";
    const cipherHash = "0x1234567890abcdef";
    const metadataHash = "0xabcdef1234567890";

    beforeEach(async function () {
      // Store data as owner
      await geoDataStorage.storeData(dataId, cipherHash, metadataHash);
    });

    it("Should allow owner to retrieve data", async function () {
      const result = await geoDataStorage.retrieveData(dataId);
      expect(result[0]).to.equal(cipherHash);
    });

    it("Should not allow unauthorized access", async function () {
      // Try to retrieve data as addr1 (unauthorized)
      await expect(
        geoDataStorage.connect(addr1).retrieveData(dataId)
      ).to.be.revertedWith("Not authorized: caller does not have access");
    });

    it("Should grant and check access correctly", async function () {
      // Initially, addr1 should not have access
      expect(await geoDataStorage.checkAccess(dataId, addr1.address)).to.equal(false);

      // Grant access to addr1
      await geoDataStorage.grantAccess(dataId, addr1.address);

      // Now addr1 should have access
      expect(await geoDataStorage.checkAccess(dataId, addr1.address)).to.equal(true);

      // addr1 should be able to retrieve data
      const result = await geoDataStorage.connect(addr1).retrieveData(dataId);
      expect(result[0]).to.equal(cipherHash);
    });

    it("Should revoke access correctly", async function () {
      // Grant access to addr1
      await geoDataStorage.grantAccess(dataId, addr1.address);

      // Revoke access from addr1
      await geoDataStorage.revokeAccess(dataId, addr1.address);

      // Now addr1 should not have access
      expect(await geoDataStorage.checkAccess(dataId, addr1.address)).to.equal(false);

      // addr1 should not be able to retrieve data
      await expect(
        geoDataStorage.connect(addr1).retrieveData(dataId)
      ).to.be.revertedWith("Not authorized: caller does not have access");
    });
  });

  describe("Data Management", function () {
    it("Should update data correctly", async function () {
      const dataId = "test-data-4";
      const cipherHash = "0x1234567890abcdef";
      const metadataHash = "0xabcdef1234567890";

      // Store initial data
      await geoDataStorage.storeData(dataId, cipherHash, metadataHash);

      // Update the data
      const newCipherHash = "0x0987654321fedcba";
      const newMetadataHash = "0xfedcba0987654321";
      await geoDataStorage.updateData(dataId, newCipherHash, newMetadataHash);

      // Retrieve updated data
      const result = await geoDataStorage.retrieveData(dataId);

      expect(result[0]).to.equal(newCipherHash);
      expect(result[1]).to.equal(newMetadataHash);
    });

    it("Should retrieve all data IDs", async function () {
      // Store multiple data entries
      await geoDataStorage.storeData("data-1", "cipher-1", "meta-1");
      await geoDataStorage.storeData("data-2", "cipher-2", "meta-2");
      await geoDataStorage.storeData("data-3", "cipher-3", "meta-3");

      // Get all data IDs
      const allIds = await geoDataStorage.getAllDataIds();

      expect(allIds.length).to.equal(3);
      expect(allIds).to.include("data-1");
      expect(allIds).to.include("data-2");
      expect(allIds).to.include("data-3");
    });

    it("Should retrieve owner's data IDs", async function () {
      // Store data as owner
      await geoDataStorage.storeData("owner-data-1", "cipher-1", "meta-1");
      await geoDataStorage.storeData("owner-data-2", "cipher-2", "meta-2");

      // Store data as addr1
      await geoDataStorage.connect(addr1).storeData("addr1-data-1", "cipher-3", "meta-3");

      // Get owner's data IDs
      const ownerIds = await geoDataStorage.getMyDataIds();

      expect(ownerIds.length).to.equal(2);
      expect(ownerIds).to.include("owner-data-1");
      expect(ownerIds).to.include("owner-data-2");
      expect(ownerIds).to.not.include("addr1-data-1");

      // Get addr1's data IDs
      const addr1Ids = await geoDataStorage.connect(addr1).getMyDataIds();

      expect(addr1Ids.length).to.equal(1);
      expect(addr1Ids).to.include("addr1-data-1");
    });
  });
});