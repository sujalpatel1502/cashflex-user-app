// services/addressApi.js
import axios from 'axios';
import Config from 'react-native-config';

const addressApi = {
  // Get all addresses for a user
  getAllAddresses: async (userId) => {
    try {
      const response = await axios.get(`${Config.API_URL}/addresses/${userId}`);
      return response.data;
    } catch (error) {
      console.log('error while getting addresses', error);
      return { success: false, error };
    }
  },
};

export default addressApi;
