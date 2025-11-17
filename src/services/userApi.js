// services/userApi.js
import axios from 'axios';
import Config from 'react-native-config';

const userApi = {
  // Get all addresses
  getAddresses: async (id) => {
    try {
      const response = await axios.get(`${Config.API_URL}/addresses/${id}`);
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log('error while getting addresses', error);
      return { success: false, error };
    }
  },

  // Create new address
  createAddress: async (data) => {
    try {
      const response = await axios.post(`${Config.API_URL}/addresses/`, data);
      return response.data;
    } catch (error) {
      console.log('error while creating address', error);
      return { success: false, error };
    }
  },

  // Update address
  updateAddress: async (data) => {
    try {
      const response = await axios.put(`${Config.API_URL}/addresses/`, data);
      return response.data;
    } catch (error) {
      console.log('error while updating address', error);
      return { success: false, error };
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await axios.put(
        `${Config.API_URL}/addresses/default/${addressId}`
      );
      return response.data;
    } catch (error) {
      console.log('error while setting default address', error);
      return { success: false, error };
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await axios.delete(
        `${Config.API_URL}/addresses/${addressId}`
      );
      return response.data;
    } catch (error) {
      console.log('error while deleting address', error);
      return { success: false, error };
    }
  },
};

export default userApi;
