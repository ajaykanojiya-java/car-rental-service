package com.ajay.carrental.strategy;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class SedanPricingStrategy implements PricingStrategy {

    @Override
    public VehicleCategory getVehicleCategory() {
        return VehicleCategory.SEDAN;
    }

    @Override
    public BigDecimal calculatePrice(PricingRequest request) {

        int pricePerDay = request.getRentalDays() < 10 ? 20 : 15;

        return BigDecimal.valueOf(pricePerDay)
                .multiply(BigDecimal.valueOf(request.getRentalDays()));
    }
}