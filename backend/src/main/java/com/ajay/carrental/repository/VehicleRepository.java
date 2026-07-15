package com.ajay.carrental.repository;

import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.VehicleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    List<Vehicle> findByAvailableTrue();

    List<Vehicle> findByCategoryAndAvailableTrue(VehicleCategory category);

    Optional<Vehicle> findFirstByCategoryAndAvailableTrue(VehicleCategory category);

    @Query("SELECT COUNT(v) FROM Vehicle v")
    Long getTotalVehicleCount();

}