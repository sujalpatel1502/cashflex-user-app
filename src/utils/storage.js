// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  IS_LOGGED_IN: 'is_logged_in',
  SKIP_LOGIN: 'skip_login',
};

export const Storage = {
  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};
