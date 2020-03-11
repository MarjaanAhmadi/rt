
import axiosInstance from "../../config/axios";
const searchOnTable = async (value, url) => {
    try {
        const response = await axiosInstance.get(url, {params: {t: value}});
        return response.data.data
    }
    catch (e) {
        console.log(e)
    }
}
export default searchOnTable();
