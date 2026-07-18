package com.ajay.carrental.config;

import com.ajay.carrental.entity.Customer;
import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.VehicleCategory;
import com.ajay.carrental.repository.CustomerRepository;
import com.ajay.carrental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

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
                        .vehicleNumber("SED003")
                        .category(VehicleCategory.SEDAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SED004")
                        .category(VehicleCategory.SEDAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SED005")
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
                        .vehicleNumber("SUV003")
                        .category(VehicleCategory.SUV)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("SUV004")
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
                        .vehicleNumber("VAN003")
                        .category(VehicleCategory.VAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("VAN004")
                        .category(VehicleCategory.VAN)
                        .available(true)
                        .build());
        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("VAN005")
                        .category(VehicleCategory.VAN)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("VAN006")
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

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK003")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());
        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK004")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK005")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());
        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK006")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());
        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK007")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());
        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK008")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());

        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK009")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());
        vehicleRepository.save(
                Vehicle.builder()
                        .vehicleNumber("PICK010")
                        .category(VehicleCategory.PICKUP_TRUCK)
                        .available(true)
                        .build());

        customerRepository.save(
                Customer.builder()
                        .name("Ajay Kanojiya")
                        .email("ajay.kanojiya@example.com")
                        .licenseIssueDate(LocalDate.now().minusYears(5))
                        .build());

        customerRepository.save(
                Customer.builder()
                        .name("Raj Kumar")
                        .email("raj.kumar@example.com")
                        .licenseIssueDate(LocalDate.now().minusYears(3))
                        .build());

        customerRepository.save(
                Customer.builder()
                        .name("Priya Singh")
                        .email("priya.singh@example.com")
                        .licenseIssueDate(LocalDate.now().minusYears(4))
                        .build());

        log.info("Loaded {} vehicles", vehicleRepository.count());
        log.info("Loaded {} customers", customerRepository.count());
    }
}