package com.ajay.carrental.dto.response;

import com.ajay.carrental.enums.ReservationStatus;
import com.ajay.carrental.enums.VehicleCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {

    private UUID reservationId;

    private String customerName;

    private String vehicleNumber;

    private VehicleCategory category;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal totalAmount;

    private ReservationStatus status;
}