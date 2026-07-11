package com.ajay.carrental.service;

import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.VehicleCategory;

public interface VehicleService {

    Vehicle getAvailableVehicle(VehicleCategory category);

    void markAvailable(Vehicle vehicle);

    void markUnavailable(Vehicle vehicle);
}