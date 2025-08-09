import axios from 'axios';

const apiClient = axios.create({
    // The baseURL points to our API Gateway, which runs on port 8000.
    // All requests will be prefixed with this URL.
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default apiClient;