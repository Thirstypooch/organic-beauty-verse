import axios from 'axios';
import {useAuthStore} from "@/stores/authStore.ts";

const apiClient = axios.create({
    // The baseURL points to our API Gateway, which runs on port 8000.
    // All requests will be prefixed with this URL.
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default apiClient;