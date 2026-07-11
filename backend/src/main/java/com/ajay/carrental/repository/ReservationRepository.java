package com.ajay.carrental.repository;

import com.ajay.carrental.entity.Reservation;
import com.ajay.carrental.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    List<Reservation> findByStatus(ReservationStatus status);
}