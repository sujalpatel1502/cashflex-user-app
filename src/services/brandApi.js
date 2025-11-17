import axios from 'axios';
import Config from 'react-native-config';

// console.log("config url",Config.API_URL)

const BrandApi = {
  getBrandByCatId: async (modelId,id) => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/product/getProductByBrandIdByCatId/${modelId}/${id}`,
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
  getModelDetails: async (id) => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/product/get-product-details-with-variant/${id}`,
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

export default BrandApi;
