package com.ajay.carrental.controller;

import com.ajay.carrental.dto.request.ReservationRequest;
import com.ajay.carrental.dto.request.ReservationUpdateRequest;
import com.ajay.carrental.dto.response.ReservationResponse;
import com.ajay.carrental.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Reserve a vehicle.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse reserve(@Valid @RequestBody ReservationRequest request) {
        return reservationService.reserve(request);
    }

    /**
     * Modify an existing reservation.
     */
    @PutMapping("/{reservationId}")
    public ReservationResponse modify(@PathVariable UUID reservationId,
            @Valid @RequestBody ReservationUpdateRequest request) {
        return reservationService.modify(reservationId, request);
    }

    /**
     * Cancel an existing reservation.
     */
    @DeleteMapping("/{reservationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable UUID reservationId) {
        reservationService.cancel(reservationId);
    }

    /**
     * Get all reservations.
     */
    @GetMapping
    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations();
    }
}