package com.ajay.carrental.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the input required to calculate the rental price for any vehicle category.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRequest {

    @Min(value = 1,message = "Rental days must be greater than zero")
    private int rentalDays;

    private double dailyMileage;

    private int licenseYears;
}