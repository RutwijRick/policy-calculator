import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const http = axios.create({ baseURL: "http://localhost:4000/api" });

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// This is where we add the response interceptor
http.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 403) {
            // Clear token and redirect to login
            localStorage.removeItem("token");
            window.location.href = "/login"; // redirect
        }
        return Promise.reject(error);
    }
);

export default http;