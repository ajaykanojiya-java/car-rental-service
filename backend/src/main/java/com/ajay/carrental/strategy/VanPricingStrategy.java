package com.ajay.carrental.strategy;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class VanPricingStrategy implements PricingStrategy {

    @Override
    public VehicleCategory getVehicleCategory() {
        return VehicleCategory.VAN;
    }

    @Override
    public BigDecimal calculatePrice(PricingRequest request) {

        return BigDecimal.valueOf(22)
                .multiply(BigDecimal.valueOf(request.getRentalDays()));
    }
}