// services/authApi.js
import axios from 'axios';
import Config from 'react-native-config';

const authApi = {
  // Login
  Login: async (data) => {
    try {
      const response = await axios.post(`${Config.API_URL}/user/login`, data);
      return response.data;
    } catch (error) {
        // console.log('error while login',);
      console.log('error while login', error);
      return { success: false, error };
    }
  },

  // Verify New Email - Send OTP
  VerifyNewEmail: async (data) => {
    try {
      const response = await axios.post(`${Config.API_URL}/user/verifyNewEmail`, data);
      return response.data;
    } catch (error) {
      console.log('error while verifying email', error);
      return { success: false, error };
    }
  },

  // Add User - Create Account
  AddUser: async (data) => {
    try {
      const response = await axios.post(`${Config.API_URL}/user/addUser`, data);
      return response.data;
    } catch (error) {
      console.log('error while adding user', error);
      return { success: false, error };
    }
  },
  UpdateUser: async (userId, data) => {
    try {
      const response = await axios.put(`${Config.API_URL}/user/updateUser/${userId}`, data);
      return response.data;
    } catch (error) {
      console.log('error while updating user', error);
      return { success: false, error };
    }
  },
};

export default authApi;
