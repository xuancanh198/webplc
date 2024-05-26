import axios from 'axios';

const APILink = axios.create({
    baseURL: 'http://localhost:4000/'
});

APILink.interceptors.request.use((config) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        config.headers['Authorization'] = `Bearer ${refreshToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default APILink;
