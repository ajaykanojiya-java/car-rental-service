package com.ajay.carrental.service.impl;

import com.ajay.carrental.dto.request.PricingRequest;
import com.ajay.carrental.dto.request.ReservationRequest;
import com.ajay.carrental.dto.request.ReservationUpdateRequest;
import com.ajay.carrental.dto.response.PricingResponse;
import com.ajay.carrental.dto.response.ReservationResponse;
import com.ajay.carrental.entity.Customer;
import com.ajay.carrental.entity.Reservation;
import com.ajay.carrental.entity.Vehicle;
import com.ajay.carrental.enums.ReservationStatus;
import com.ajay.carrental.exception.ReservationNotFoundException;
import com.ajay.carrental.mapper.ReservationMapper;
import com.ajay.carrental.repository.ReservationRepository;
import com.ajay.carrental.service.CustomerService;
import com.ajay.carrental.service.PricingService;
import com.ajay.carrental.service.ReservationService;
import com.ajay.carrental.service.VehicleService;
import com.ajay.carrental.util.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    private final CustomerService customerService;

    private final VehicleService vehicleService;

    private final PricingService pricingService;

    private final ReservationMapper reservationMapper;

    @Override
    public ReservationResponse reserve(ReservationRequest request) {

        Customer customer = getCustomer(request);
        Vehicle vehicle = allocateVehicle(request);
        BigDecimal amount = calculateAmount(request);
        Reservation reservation = createReservation(request, customer, vehicle, amount);
        markVehicleReserved(vehicle);
        log.info("Creating reservation for customer {}", request.getCustomerName());
        return reservationMapper.toResponse(reservation);
    }

    @Override
    public ReservationResponse modify(UUID reservationId, ReservationUpdateRequest request) {

        log.info("Modifying reservation {}", reservationId);
        Reservation reservation = findReservation(reservationId);
        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(request.getEndDate());
        reservation.setDailyMileage(request.getDailyMileage());

        PricingRequest pricingRequest = PricingRequest.builder()
                .rentalDays(DateUtils.getRentalDays(request.getStartDate(), request.getEndDate()))
                .dailyMileage(request.getDailyMileage())
                .licenseYears(DateUtils.getLicenseYears(reservation.getCustomer().getLicenseIssueDate()))
                .build();

        BigDecimal amount = pricingService.calculatePrice(reservation.getVehicle().getCategory(), pricingRequest);

        reservation.setTotalAmount(amount);
        Reservation updatedReservation = reservationRepository.save(reservation);
        log.info("Modified reservation {}", reservationId);
        return reservationMapper.toResponse(updatedReservation);

    }

    @Override
    public void cancel(UUID reservationId) {

        log.info("Cancelling reservation {}", reservationId);
        Reservation reservation = findReservation(reservationId);
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            return;
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        vehicleService.markAvailable(reservation.getVehicle());
        log.info("Cancelled reservation {}", reservationId);
    }

    @Override
    public List<ReservationResponse> getAllReservations() {

        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toResponse)
                .sorted(Comparator.comparing(ReservationResponse::getCustomerName))
                .toList();
    }

    /*------------------------------------------------------*/

    private Customer getCustomer(ReservationRequest request) {

        return customerService.getOrCreateCustomer(
                request.getCustomerName(),
                request.getLicenseYears());
    }

    private Vehicle allocateVehicle(ReservationRequest request) {
        return vehicleService.getAvailableVehicle(request.getVehicleCategory());
    }

    private BigDecimal calculateAmount(ReservationRequest request) {
        return pricingService.calculatePrice(request.getVehicleCategory(), buildPricingRequest(request));
    }

    private Reservation createReservation(ReservationRequest request, Customer customer, Vehicle vehicle,
            BigDecimal amount) {

        Reservation reservation = Reservation.builder()
                        .customer(customer)
                        .vehicle(vehicle)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .dailyMileage(request.getDailyMileage())
                        .totalAmount(amount)
                        .status(ReservationStatus.ACTIVE)
                        .build();

        return reservationRepository.save(reservation);
    }

    private void markVehicleReserved(
            Vehicle vehicle) {
        vehicleService.markUnavailable(vehicle);
    }

    private PricingRequest buildPricingRequest(ReservationRequest request) {

        int rentalDays = (int) ChronoUnit.DAYS.between(
                        request.getStartDate(),
                        request.getEndDate());

        return PricingRequest.builder()
                .rentalDays(rentalDays)
                .dailyMileage(request.getDailyMileage())
                .licenseYears(request.getLicenseYears())
                .build();
    }

    private Reservation findReservation(UUID reservationId) {

        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));
    }

}