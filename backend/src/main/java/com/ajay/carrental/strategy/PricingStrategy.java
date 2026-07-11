package com.ajay.carrental.strategy;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.enums.VehicleCategory;

import java.math.BigDecimal;

public interface PricingStrategy {

    /**
     * Returns the vehicle category supported by this strategy.
     */
    VehicleCategory getVehicleCategory();

    /**
     * Calculates the total rental amount.
     */
    BigDecimal calculatePrice(PricingRequest request);

}