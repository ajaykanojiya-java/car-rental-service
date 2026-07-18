import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const AUTH_KEY = "car_rental_auth";

const authService = {
    async sendOtp(email) {
        const response = await apiClient.post(API_ENDPOINTS.SEND_OTP, { email });
        return response.data;
    },

    async verifyOtp(email, otp) {
        const response = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, { email, otp });
        return response.data;
    },

    login(loginResponse) {
        localStorage.setItem(
            AUTH_KEY,
            JSON.stringify({
                token: loginResponse.token,
                role: loginResponse.role,
                email: loginResponse.email,
                customerName: loginResponse.customerName,
            })
        );
    },

    logout() {
        localStorage.removeItem(AUTH_KEY);
    },

    getAuth() {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    },

    getToken() {
        return this.getAuth()?.token || null;
    },

    getRole() {
        return this.getAuth()?.role || null;
    },

    getEmail() {
        return this.getAuth()?.email || null;
    },

    getCustomerName() {
        return this.getAuth()?.customerName || null;
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isAdmin() {
        return this.getRole() === "ADMIN";
    },

    isCustomer() {
        return this.getRole() === "CUSTOMER";
    }
};

export default authService;