package com.ajay.carrental.config;

import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.VehicleCategory;
import com.ajay.carrental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) {

        if (vehicleRepository.count() > 0) {
            return;
        }

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SED001")
                        .category(VehicleCategory.SEDAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SED002")
                        .category(VehicleCategory.SEDAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SUV001")
                        .category(VehicleCategory.SUV)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SUV002")
                        .category(VehicleCategory.SUV)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("VAN001")
                        .category(VehicleCategory.VAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("VAN002")
                        .category(VehicleCategory.VAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK001")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK002")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());

        log.info("Loaded {} vehicles", vehicleRepository.count());
    }
}