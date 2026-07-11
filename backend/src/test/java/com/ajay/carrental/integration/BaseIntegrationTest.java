package com.ajay.carrental.integration;

import com.ajay.carrental.repository.CustomerRepository;
import com.ajay.carrental.repository.ReservationRepository;
import com.ajay.carrental.repository.VehicleRepository;
import com.ajay.carrental.util.TestDataLoader;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.TimeZone;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    protected ReservationRepository reservationRepository;

    @Autowired
    protected CustomerRepository customerRepository;

    @Autowired
    protected VehicleRepository vehicleRepository;

    @Autowired
    protected TestDataLoader testDataLoader;

    static {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }
    @BeforeEach
    void cleanDatabase() {

        reservationRepository.deleteAll();
        customerRepository.deleteAll();

        if (vehicleRepository.count() == 0) {
            testDataLoader.loadVehicleData();
        }
    }
}