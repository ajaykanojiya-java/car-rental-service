package com.ajay.carrental.service.impl;

import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.VehicleCategory;
import com.ajay.carrental.exception.VehicleNotAvailableException;
import com.ajay.carrental.repository.VehicleRepository;
import com.ajay.carrental.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public Vehicle getAvailableVehicle(VehicleCategory category) {

        return vehicleRepository
                .findFirstByCategoryAndAvailableTrue(category)
                .orElseThrow(() -> new VehicleNotAvailableException("No " + category + " vehicle available."));
    }

    @Override
    public void markAvailable(Vehicle vehicle) {

        vehicle.setAvailable(true);
        vehicleRepository.save(vehicle);
    }

    @Override
    public void markUnavailable(Vehicle vehicle) {

        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);
    }

    @Override
    public Long getTotalVehicleCount() {
        return vehicleRepository.getTotalVehicleCount();
    }
}