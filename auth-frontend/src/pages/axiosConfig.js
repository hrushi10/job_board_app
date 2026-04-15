import axios from 'axios';

const api = axios.create({
     // baseURL: "http://192.168.68.80:5000",
      baseURL: "http://localhost:5000",
    withCredentials: true, // Ensures cookies are sent with requests
});

export default api;