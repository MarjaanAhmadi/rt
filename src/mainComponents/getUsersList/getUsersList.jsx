
import axiosInstance from "../../config/axios";

const getUsersList = async () => {
    try {
            const response = await axiosInstance.get('/users/api/user/');
            return response.data.data;
    }
    catch (e) {
        console.log(e)
    }

}
export default getUsersList;
