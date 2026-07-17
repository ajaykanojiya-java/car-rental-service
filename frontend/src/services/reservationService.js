import apiClient from "../api/axios";
import API_ENDPOINTS from "../constants/apiEndpoints";

const reservationService = {
  /**
   * Get all reservations
   */
  getReservations: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.RESERVATIONS
    );

    return response.data;
  },

  /**
   * Get reservations by customer email
   */
  getReservationsByCustomerEmail: async (
    customerEmail
  ) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.RESERVATIONS_BY_CUSTOMER}/${encodeURIComponent(
        customerEmail
      )}`
    );

    return response.data;
  },

  /**
   * Create reservation
   */
  createReservation: async (
    reservationRequest
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.RESERVATIONS,
      reservationRequest
    );

    return response.data;
  },

  /**
   * Update reservation
   */
updateReservation: async (
  reservationId,
  request
) => {
  const response = await apiClient.put(
    `${API_ENDPOINTS.RESERVATIONS}/${reservationId}`,
    request
  );

  return response.data;
},

  /**
   * Cancel reservation
   */
  cancelReservation: async (id) => {
    await apiClient.delete(
      `${API_ENDPOINTS.RESERVATIONS}/${id}`
    );
  },
};

export default reservationService;