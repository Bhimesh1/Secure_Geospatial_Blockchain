import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize Web3
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get connected account
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        // Get network ID
        const netId = await web3Instance.eth.net.getId();
        setNetworkId(netId);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });

        return true;
      } else {
        setError('Please install MetaMask to use this application');
        return false;
      }
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setError(null);
  };

  useEffect(() => {
    // Check if we're already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      web3,
      account,
      networkId,
      error,
      connectWallet,
      disconnectWallet,
      isConnected: !!account
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 