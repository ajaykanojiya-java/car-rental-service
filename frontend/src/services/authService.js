import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const authService = {
    sendOtp: async (email) => {
        const response = await apiClient.post(
            API_ENDPOINTS.SEND_OTP,
            { email }
        );

        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await apiClient.post(
            API_ENDPOINTS.VERIFY_OTP,
            {
                email,
                otp,
            }
        );

        return response.data;
    },
};

export default authService;