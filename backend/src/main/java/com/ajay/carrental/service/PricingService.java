package com.ajay.carrental.service;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.dto.response.PricingResponse;
import com.ajay.carrental.enums.VehicleCategory;

import java.math.BigDecimal;
import java.util.List;

public interface PricingService {
    List<PricingResponse> getPricingOptions(PricingRequest request);
    BigDecimal calculatePrice(VehicleCategory category, PricingRequest request);
}
