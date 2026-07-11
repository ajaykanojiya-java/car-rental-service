package com.ajay.carrental.strategy;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class SuvPricingStrategy implements PricingStrategy {

    @Override
    public VehicleCategory getVehicleCategory() {
        return VehicleCategory.SUV;
    }

    @Override
    public BigDecimal calculatePrice(PricingRequest request) {

        double total =
                (15 * request.getRentalDays())
                        + (request.getDailyMileage()
                        * request.getRentalDays()
                        * 0.50);

        return BigDecimal.valueOf(total);
    }
}