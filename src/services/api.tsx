import axios from "axios";


const api = axios.create({
    baseURL: "https://barbergo-api.onrender.com/api/auth",
});

// Interceptor para adicionar token no request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para tratar resposta com erro 401 (token expirado)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token inválido/expirado
            localStorage.removeItem("token");
            window.location.href = "/login"; // redireciona para login
        }
        return Promise.reject(error);
    }
);

export default api;
