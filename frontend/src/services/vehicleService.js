import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const vehicleService = {
  getVehicleCount: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.VEHICLE_COUNT
    );

    return response.data;
  },

  getVehicles: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.VEHICLES
    );

    return response.data;
  },
};

export default vehicleService;