import axios from 'axios';

const api = axios.create({
    baseURL: "http://10.0.0.53:5000",
   // baseURL: "http://localhost:5000",
    withCredentials: true, // Ensures cookies are sent with requests
});

export default api;