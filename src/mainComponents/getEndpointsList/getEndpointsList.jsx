
import axiosInstance from "../../config/axios";

const getEndpointsList = async () => {
    try {
            const response = await axiosInstance.get('/endpoint/api/endpoint/');
            return response.data.data;
    }
    catch (e) {
        console.log(e)
    }

}
export default getEndpointsList;
