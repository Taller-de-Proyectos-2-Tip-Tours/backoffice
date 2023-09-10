import axios from "axios";
import CookieService from "./CookieService";
const apiClient = axios.create({
  baseURL: "https://tdp2-backend.onrender.com",
  headers: {
    "Accept-Header": "application/json"
  },
});


apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // detectExpiredSessionFromMessage(error.response?.data?.message);
    //return Promise.reject(error.response?.data);
    console.log('axios err',error.response);

    if(error.response&&(error.response.status===401||error.response.status===0)){
      CookieService.delete('token');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
