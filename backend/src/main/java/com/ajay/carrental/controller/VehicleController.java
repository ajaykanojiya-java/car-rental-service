package com.ajay.carrental.controller;

import com.ajay.carrental.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/count")
    public Long getVehicleCount() {
        return vehicleService.getTotalVehicleCount();
    }
}