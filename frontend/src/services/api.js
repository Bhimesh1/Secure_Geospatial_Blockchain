import axios from 'axios';

const API_URL = 'http://127.0.0.1:8001/api';

const api = {
  // Data endpoints
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/data/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  encryptData: (fileName, useRsa = false) => {
    return axios.post(`${API_URL}/data/encrypt`, {
      file: fileName,
      use_rsa: useRsa,
    });
  },

  listFiles: () => {
    return axios.get(`${API_URL}/data/files`);
  },

  listPreUploadedDatasets: () => {
    return axios.get(`${API_URL}/data/datasets`);
  },

  getDatasetContent: (datasetName) => {
    return axios.get(`${API_URL}/data/datasets/${encodeURIComponent(datasetName)}`);
  },

  // Blockchain endpoints
  storeOnBlockchain: (encryptedFile, originalFile) => {
    return axios.post(`${API_URL}/blockchain/store`, {
      encrypted_file: encryptedFile,
      original_file: originalFile,
    });
  },

  retrieveFromBlockchain: (dataId) => {
    return axios.get(`${API_URL}/blockchain/retrieve/${dataId}`);
  },

  grantAccess: (dataId, address) => {
    return axios.post(`${API_URL}/blockchain/access/grant`, {
      data_id: dataId,
      address: address,
    });
  },

  revokeAccess: (dataId, address) => {
    return axios.post(`${API_URL}/blockchain/access/revoke`, {
      data_id: dataId,
      address: address,
    });
  },

  checkAccess: (dataId, address) => {
    return axios.get(`${API_URL}/blockchain/access/check?data_id=${encodeURIComponent(dataId)}&address=${encodeURIComponent(address)}`);
  },

  getDataIds: (ownedOnly = false) => {
    return axios.get(`${API_URL}/blockchain/data?owned=${ownedOnly}`);
  },
};

export default api;