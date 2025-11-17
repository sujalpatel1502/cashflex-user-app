import axios from 'axios';
import Config from 'react-native-config';

// console.log("config url",Config.API_URL)

const ordersApi = {
  getAllOrders: async (email) => {
    try {
      console.log("email in api--->>>>>>",email)
      const response = await axios.get(
        `${Config.API_URL}/user/getAllOrders/${email}`,
      );
    //   console.log("response of category",response)
      if (response) {

        return response.data;
      }
    } catch (error) {
        console.log("error while getting orders",error)
      return error.status;
    }
  }
};

export default ordersApi;
