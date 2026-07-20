import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const AUTH_KEY = "car_rental_auth";

const isPlainObject = (value) =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);

const toTrimmedString = (value) =>
    typeof value === "string" ? value.trim() : "";

const authService = {
    async sendOtp(requestOrAddress, channel = "EMAIL") {
        const payload = isPlainObject(requestOrAddress)
            ? {
                  address: toTrimmedString(requestOrAddress.address),
                  channel: requestOrAddress.channel || "EMAIL",
              }
            : {
                  address: toTrimmedString(requestOrAddress),
                  channel,
              };

        const response = await apiClient.post(
            API_ENDPOINTS.SEND_OTP,
            JSON.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    async verifyOtp(requestOrAddress, otp) {
        const payload = isPlainObject(requestOrAddress)
            ? {
                  address: toTrimmedString(requestOrAddress.address),
                  otp: requestOrAddress.otp,
              }
            : {
                  address: toTrimmedString(requestOrAddress),
                  otp,
              };

        const response = await apiClient.post(
            API_ENDPOINTS.VERIFY_OTP,
            JSON.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
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
