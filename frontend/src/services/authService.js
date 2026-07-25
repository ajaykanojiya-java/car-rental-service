import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";
import { STORAGE_KEYS } from "../constants/authConstants";

const isPlainObject = (value) =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);

const toTrimmedString = (value) =>
    typeof value === "string" ? value.trim() : "";

const getSession = () => {
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch (error) {
        console.error("Invalid authentication session.", error);
        return null;
    }
};

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

    async adminLogin(email, passwordHash) {
        const response = await apiClient.post(
            API_ENDPOINTS.ADMIN_LOGIN,
            JSON.stringify({ email, passwordHash }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    login(loginResponse) {
        const session = {
            token: loginResponse.token,
            role: loginResponse.role,
            email: loginResponse.email,
            customerName: loginResponse.customerName,
        };
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    },

    getAuth() {
        return getSession();
    },

    getToken() {
        return getSession()?.token || null;
    },

    getRole() {
        return getSession()?.role || null;
    },

    getEmail() {
        return getSession()?.email || null;
    },

    getCustomerName() {
        return getSession()?.customerName || null;
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
