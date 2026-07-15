import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const reservationService = {
  getReservations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.RESERVATIONS);
    return response.data;
  },

  createReservation: async (reservation) => {
    const response = await apiClient.post(
      API_ENDPOINTS.RESERVATIONS,
      reservation
    );

    return response.data;
  },

  updateReservation: async (id, reservation) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.RESERVATIONS}/${id}`,
      reservation
    );

    return response.data;
  },

  cancelReservation: async (id) => {
    await apiClient.delete(
      `${API_ENDPOINTS.RESERVATIONS}/${id}`
    );
  },
};

export default reservationService;