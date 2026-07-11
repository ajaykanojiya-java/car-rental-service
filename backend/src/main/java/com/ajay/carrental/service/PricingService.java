package com.ajay.carrental.service;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.dto.response.PricingResponse;

import java.util.List;

public interface PricingService {
    List<PricingResponse> getPricingOptions(PricingRequest request);
}
