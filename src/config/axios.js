
import axios from 'axios';
import {toast} from "react-toastify";
import i18next from "i18next";

//define an instance from Axios and set headers and baseurl => because we are using proxy we can't set base url

let axiosInstance = axios.create({
    timeout: 1100000,
    baseURL: process.env.REACT_APP_BASE_API,
    headers: {
        headers: {'Access-Control-Allow-Origin': '*'}
    }
})
axiosInstance.interceptors.response.use(null, (error) => {
    if (error.response.status === 500) {
        toast.error(i18next.t('ServerError'));
    }
    if (error.response.status === 400) {
        toast.error(i18next.t('BadData'));
    }
    if (error.response.status === 401) {
        localStorage.removeItem('admin-token');
        window.location.href='/login';
    }
    if (error.response.status === 409) {
        toast.error(error.response.data.error);
    }

    return Promise.reject(error)
})

export default axiosInstance;

