package com.ajay.carrental.dto.request;

import com.ajay.carrental.enums.VehicleCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {

    @NotBlank(message = "Customer name is mandatory")
    private String customerName;

    @NotNull
    private VehicleCategory vehicleCategory;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Min(0)
    private Integer dailyMileage;

    @Min(0)
    private Integer licenseYears;
}