import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const pricingService = {
  calculatePricing: async (request) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRICING,
      request
    );

    return response.data;
  },
};

export default pricingService;