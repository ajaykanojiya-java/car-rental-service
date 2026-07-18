import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const customerService = {
    getCustomers: async () => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS);
        return response.data;
    },

    getCustomerByEmail: async (email) => {
        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/${encodeURIComponent(email)}`);
        return response.data;
    },
};

export default customerService;