package com.ajay.carrental.strategy;

import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class PricingStrategyFactory {

    private final Map<VehicleCategory, PricingStrategy> strategyMap =
            new EnumMap<>(VehicleCategory.class);

    public PricingStrategyFactory(List<PricingStrategy> strategies) {

        strategies.forEach(strategy ->
                strategyMap.put(strategy.getVehicleCategory(), strategy));
    }

    public PricingStrategy getStrategy(VehicleCategory category) {

        PricingStrategy strategy = strategyMap.get(category);

        if (strategy == null) {
            throw new IllegalArgumentException(
                    "No pricing strategy found for " + category);
        }

        return strategy;
    }
}