package com.ajay.carrental.strategy;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PickupTruckPricingStrategy implements PricingStrategy {

    @Override
    public VehicleCategory getVehicleCategory() {
        return VehicleCategory.PICKUP_TRUCK;
    }

    @Override
    public BigDecimal calculatePrice(PricingRequest request) {

        BigDecimal amount = BigDecimal.valueOf(30)
                .multiply(BigDecimal.valueOf(request.getRentalDays()));

        if (request.getLicenseYears() < 3) {
            amount = amount.multiply(BigDecimal.valueOf(1.10));
        }

        return amount;
    }
}