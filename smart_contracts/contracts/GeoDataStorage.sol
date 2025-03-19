// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GeoDataStorage
 * @dev Store encrypted geospatial data references on the blockchain
 */
contract GeoDataStorage {
    // Contract owner
    address private owner;

    // Structure for storing encrypted data reference
    struct EncryptedData {
        string cipherHash;      // Hash of the encrypted data
        string metadataHash;    // Hash of the metadata
        uint256 timestamp;      // Timestamp when data was stored
        address owner;          // Owner of this data entry
        bool exists;            // Flag to check if data exists
    }

    // Mapping from data ID to EncryptedData
    mapping(string => EncryptedData) private dataStore;

    // Array to keep track of all data IDs
    string[] private dataIds;

    // Access control mapping
    mapping(address => mapping(string => bool)) private accessControl;

    // Events
    event DataStored(string dataId, address indexed owner, uint256 timestamp);
    event AccessGranted(string dataId, address indexed grantee, address indexed grantor);
    event AccessRevoked(string dataId, address indexed revokee, address indexed revoker);

    /**
     * @dev Constructor sets the contract owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to check if caller is the contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: caller is not the owner");
        _;
    }

    /**
     * @dev Modifier to check if caller has access to the data
     */
    modifier hasAccess(string memory dataId) {
        require(
            msg.sender == dataStore[dataId].owner ||
            accessControl[msg.sender][dataId] == true,
            "Not authorized: caller does not have access"
        );
        _;
    }

    /**
     * @dev Store encrypted data reference
     * @param dataId Unique identifier for the data
     * @param cipherHash Hash of the encrypted data
     * @param metadataHash Hash of the metadata
     */
    function storeData(
        string memory dataId,
        string memory cipherHash,
        string memory metadataHash
    ) public {
        // Ensure data ID doesn't already exist
        require(!dataStore[dataId].exists, "Data ID already exists");

        // Store the encrypted data reference
        dataStore[dataId] = EncryptedData({
            cipherHash: cipherHash,
            metadataHash: metadataHash,
            timestamp: block.timestamp,
            owner: msg.sender,
            exists: true
        });

        // Add data ID to the array
        dataIds.push(dataId);

        // Emit event
        emit DataStored(dataId, msg.sender, block.timestamp);
    }

    /**
     * @dev Retrieve encrypted data reference
     * @param dataId Unique identifier for the data
     * @return cipherHash, metadataHash, timestamp, owner
     */
    function retrieveData(string memory dataId)
        public
        view
        hasAccess(dataId)
        returns (string memory, string memory, uint256, address)
    {
        // Ensure data exists
        require(dataStore[dataId].exists, "Data not found");

        // Return the encrypted data reference
        return (
            dataStore[dataId].cipherHash,
            dataStore[dataId].metadataHash,
            dataStore[dataId].timestamp,
            dataStore[dataId].owner
        );
    }

    /**
     * @dev Grant access to data for a specific address
     * @param dataId Unique identifier for the data
     * @param grantee Address to grant access to
     */
    function grantAccess(string memory dataId, address grantee)
        public
    {
        // Ensure data exists and caller is the owner
        require(dataStore[dataId].exists, "Data not found");
        require(dataStore[dataId].owner == msg.sender, "Not authorized: caller is not the data owner");

        // Grant access
        accessControl[grantee][dataId] = true;

        // Emit event
        emit AccessGranted(dataId, grantee, msg.sender);
    }

    /**
     * @dev Revoke access to data for a specific address
     * @param dataId Unique identifier for the data
     * @param revokee Address to revoke access from
     */
    function revokeAccess(string memory dataId, address revokee)
        public
    {
        // Ensure data exists and caller is the owner
        require(dataStore[dataId].exists, "Data not found");
        require(dataStore[dataId].owner == msg.sender, "Not authorized: caller is not the data owner");

        // Revoke access
        accessControl[revokee][dataId] = false;

        // Emit event
        emit AccessRevoked(dataId, revokee, msg.sender);
    }

    /**
     * @dev Check if address has access to data
     * @param dataId Unique identifier for the data
     * @param addr Address to check
     * @return boolean indicating if address has access
     */
    function checkAccess(string memory dataId, address addr)
        public
        view
        returns (bool)
    {
        // Ensure data exists
        require(dataStore[dataId].exists, "Data not found");

        // Check if address is the owner or has been granted access
        return (dataStore[dataId].owner == addr || accessControl[addr][dataId]);
    }

    /**
     * @dev Get all data IDs
     * @return array of data IDs
     */
    function getAllDataIds()
        public
        view
        returns (string[] memory)
    {
        return dataIds;
    }

    /**
     * @dev Get data IDs owned by the caller
     * @return array of data IDs owned by the caller
     */
    function getMyDataIds()
        public
        view
        returns (string[] memory)
    {
        // Count how many data IDs are owned by the caller
        uint256 count = 0;
        for (uint256 i = 0; i < dataIds.length; i++) {
            if (dataStore[dataIds[i]].owner == msg.sender) {
                count++;
            }
        }

        // Create array of the right size
        string[] memory myDataIds = new string[](count);

        // Fill the array
        uint256 index = 0;
        for (uint256 i = 0; i < dataIds.length; i++) {
            if (dataStore[dataIds[i]].owner == msg.sender) {
                myDataIds[index] = dataIds[i];
                index++;
            }
        }

        return myDataIds;
    }

    /**
     * @dev Update encrypted data reference
     * @param dataId Unique identifier for the data
     * @param cipherHash New hash of the encrypted data
     * @param metadataHash New hash of the metadata
     */
    function updateData(
        string memory dataId,
        string memory cipherHash,
        string memory metadataHash
    )
        public
    {
        // Ensure data exists and caller is the owner
        require(dataStore[dataId].exists, "Data not found");
        require(dataStore[dataId].owner == msg.sender, "Not authorized: caller is not the data owner");

        // Update the encrypted data reference
        dataStore[dataId].cipherHash = cipherHash;
        dataStore[dataId].metadataHash = metadataHash;
        dataStore[dataId].timestamp = block.timestamp;

        // Emit event
        emit DataStored(dataId, msg.sender, block.timestamp);
    }
}