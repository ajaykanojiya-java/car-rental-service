package com.ajay.carrental.service.impl;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.dto.response.PricingResponse;
import com.ajay.carrental.service.PricingService;
import com.ajay.carrental.strategy.PricingStrategy;
import com.ajay.carrental.strategy.PricingStrategyFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PricingStrategyFactory strategyFactory;

    @Override
    public List<PricingResponse> getPricingOptions(PricingRequest request) {

        return strategyFactory.getAllStrategies()
                .stream()
                .map(strategy -> buildPricingResponse(strategy, request))
                .sorted(Comparator.comparing(PricingResponse::getTotalAmount))
                .toList();
    }

    private PricingResponse buildPricingResponse(PricingStrategy strategy, PricingRequest request) {

        return PricingResponse.builder()
                .category(strategy.getVehicleCategory())
                .totalAmount(strategy.calculatePrice(request))
                .build();
    }
}