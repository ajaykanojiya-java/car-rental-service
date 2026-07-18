import axios from "axios";
import authService from "../services/authService";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect to login if the user had an active session (token expired).
        // Unauthenticated pre-login API calls (e.g., during OTP flow) should not redirect.
        if (error.response?.status === 401 && authService.isAuthenticated()) {
            authService.logout();

            // Redirect to login page
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;