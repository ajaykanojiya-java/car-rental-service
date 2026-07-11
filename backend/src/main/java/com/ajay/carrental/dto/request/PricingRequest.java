package com.ajay.carrental.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the input required to calculate the rental price
 * for any vehicle category.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRequest {

    /**
     * Total number of rental days.
     */
    private int rentalDays;

    /**
     * Expected miles driven per day. Used only for SUV pricing.
     */
    private double dailyMileage;

    /**
     * Driver's license age in years. Used only for Pickup Truck pricing.
     */
    private int licenseYears;
}