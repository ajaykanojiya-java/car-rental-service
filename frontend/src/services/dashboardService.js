import reservationService from "./reservationService";
import vehicleService from "./vehicleService";

const dashboardService = {
  getDashboardSummary: async (role, email) => {
    const reservationsPromise =
        role === "ADMIN"
            ? reservationService.getReservations()
            : reservationService.getReservationsByCustomerEmail(
                  email
              );

    const [vehicleCount, reservations] =
        await Promise.all([
            vehicleService.getVehicleCount(),
            reservationsPromise,
        ]);

    const activeReservations = reservations.filter(
      (reservation) => reservation.status === "ACTIVE"
    );

    const revenue = activeReservations.reduce(
      (sum, reservation) => sum + Number(reservation.totalAmount),
      0
    );

    return {
        totalCars: vehicleCount,
        availableCars: vehicleCount - activeReservations.length,
        reservations: reservations.length,
        activeRentals: activeReservations.length,
        totalAmount: revenue.toLocaleString("en-IN", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }),
    };
  },
};

export default dashboardService;