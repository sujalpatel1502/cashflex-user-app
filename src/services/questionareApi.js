import axios from 'axios';
import Config from 'react-native-config';

// console.log("config url",Config.API_URL)

const QuestionareApi = {
  
  getQuestionareById: async (id) => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/questionares/getQuestionareByProductId/${id}`,
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

export default QuestionareApi;
