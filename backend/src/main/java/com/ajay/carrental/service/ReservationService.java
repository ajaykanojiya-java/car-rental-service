package com.ajay.carrental.service;

import com.ajay.carrental.dto.request.ReservationRequest;
import com.ajay.carrental.dto.request.ReservationUpdateRequest;
import com.ajay.carrental.dto.response.ReservationResponse;
import com.ajay.carrental.entity.Customer;

import java.util.List;
import java.util.UUID;

public interface ReservationService {

    ReservationResponse reserve(ReservationRequest request);

    ReservationResponse modify(UUID reservationId, ReservationUpdateRequest request);

    void cancel(UUID reservationId);

    List<ReservationResponse> getAllReservations();

    List<ReservationResponse> getReservationsByCustomerEmail(String email);
}