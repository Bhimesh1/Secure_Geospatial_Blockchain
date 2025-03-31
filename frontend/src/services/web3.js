import Web3 from 'web3';

// Contract ABI (Replace with your actual ABI)
const contractABI = []; // Add your contract ABI here

// Contract address
const contractAddress = ''; // Add your deployed contract address here

class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.accounts = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        this.web3 = new Web3(window.ethereum);
        this.accounts = await this.web3.eth.getAccounts();

        // Initialize contract
        if (contractABI.length > 0 && contractAddress) {
          this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
        }

        this.initialized = true;
        return true;
      } catch (error) {
        console.error('User denied account access', error);
        return false;
      }
    } else if (window.web3) {
      // Legacy dapp browsers
      this.web3 = new Web3(window.web3.currentProvider);
      this.accounts = await this.web3.eth.getAccounts();

      // Initialize contract
      if (contractABI.length > 0 && contractAddress) {
        this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
      }

      this.initialized = true;
      return true;
    } else {
      console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
      return false;
    }
  }

  async getCurrentAccount() {
    if (!this.initialized) await this.init();
    return this.accounts.length > 0 ? this.accounts[0] : null;
  }
}

export default new Web3Service();