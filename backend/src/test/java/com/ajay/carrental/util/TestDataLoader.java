package com.ajay.carrental.util;

import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.VehicleCategory;
import com.ajay.carrental.repository.VehicleRepository;
import org.springframework.stereotype.Component;

@Component
public class TestDataLoader {

    private final VehicleRepository vehicleRepository;

    public TestDataLoader(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public void loadVehicleData() {

        if (vehicleRepository.count() > 0) {
            return;
        }

        createVehicle("SED001", VehicleCategory.SEDAN);
        createVehicle("SED002", VehicleCategory.SEDAN);

        createVehicle("SUV001", VehicleCategory.SUV);
        createVehicle("SUV002", VehicleCategory.SUV);

        createVehicle("VAN001", VehicleCategory.VAN);
        createVehicle("VAN002", VehicleCategory.VAN);

        createVehicle("PICK001", VehicleCategory.PICKUP_TRUCK);
        createVehicle("PICK002", VehicleCategory.PICKUP_TRUCK);
    }

    private void createVehicle(String vehicleNumber, VehicleCategory category) {

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber(vehicleNumber)
                        .category(category)
                        .available(true)
                        .build());
    }

}