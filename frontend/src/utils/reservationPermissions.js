import { USER_ROLES } from "../constants/authConstants";

export const canEditReservation = (
    reservation,
    role
) => {
    if (!reservation) {
        return false;
    }

    if (role === USER_ROLES.ADMIN) {
        return reservation.status === "ACTIVE";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(reservation.startDate);

    return (
        reservation.status === "ACTIVE" &&
        startDate >= today
    );
};

export const canCancelReservation = (
    reservation,
    role
) => {
    return canEditReservation(
        reservation,
        role
    );
};

export const getReservationPermissionMessage = (
    reservation
) => {
    if (!reservation) {
        return "";

    }

    if (reservation.status !== "ACTIVE") {
        return "Only active reservations can be modified.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(reservation.startDate);

    if (startDate < today) {
        return "Reservation has already started.";
    }

    return "";
};