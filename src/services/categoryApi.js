import axios from 'axios';
import Config from 'react-native-config';

// console.log("config url",Config.API_URL)

const categoryApi = {
  getCategories: async body => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/category/getAllCategory`,
      );
    //   console.log("response of category",response)
      if (response) {

        return response.data;
      }
    } catch (error) {
        console.log("error while getting category",error)
      return error.status;
    }
  },
  getCategoryDetails: async (id) => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/brand/getAllMobileBrand/${id}`,
      );
    //   console.log("response of category",response)
      if (response) {

        return response.data;
      }
    } catch (error) {
        console.log("error while getting category",error)
      return error.status;
    }
  },
};

export default categoryApi;
