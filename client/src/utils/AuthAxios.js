import axios from "axios";

export const BASE_URL = "http://localhost:5001";
const AuthAxios = axios.create();

AuthAxios.defaults.baseURL = BASE_URL;

AuthAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default AuthAxios;
