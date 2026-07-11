package com.ajay.carrental.controller;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.dto.response.PricingResponse;
import com.ajay.carrental.service.PricingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    @PostMapping("/options")
    public List<PricingResponse> getPricingOptions(
            @Valid @RequestBody PricingRequest request) {

        return pricingService.getPricingOptions(request);
    }
}