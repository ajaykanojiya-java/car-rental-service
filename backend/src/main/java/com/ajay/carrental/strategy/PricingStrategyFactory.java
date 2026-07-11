package com.ajay.carrental.strategy;

import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.stereotype.Component;

import java.util.Collection;
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

    /**
     * Returns strategy for a specific vehicle category.
     */
    public PricingStrategy getStrategy(VehicleCategory category) {

        PricingStrategy strategy = strategyMap.get(category);

        if (strategy == null) {
            throw new IllegalArgumentException(
                    "No PricingStrategy found for " + category);
        }

        return strategy;
    }

    /**
     * Returns all registered pricing strategies.
     */
    public Collection<PricingStrategy> getAllStrategies() {

        return strategyMap.values();
    }
}