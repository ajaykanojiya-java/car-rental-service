package com.ajay.carrental.mapper;

import com.ajay.carrental.dto.response.ReservationResponse;
import com.ajay.carrental.entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationResponse toResponse(Reservation reservation) {

        return ReservationResponse.builder()
                .reservationId(reservation.getId())
                .customerName(reservation.getCustomer().getName())
                .customerEmail(reservation.getCustomer().getEmail())
                .vehicleNumber(reservation.getVehicle().getVehicleNumber())
                .category(reservation.getVehicle().getCategory())
                .startDate(reservation.getStartDate())
                .endDate(reservation.getEndDate())
                .dailyMileage(reservation.getDailyMileage())
                .totalAmount(reservation.getTotalAmount())
                .status(reservation.getStatus())
                .build();
    }
}