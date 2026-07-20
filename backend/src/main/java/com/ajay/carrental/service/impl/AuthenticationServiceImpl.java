package com.ajay.carrental.service.impl;

import com.ajay.carrental.dto.auth.LoginResponse;
import com.ajay.carrental.dto.request.OtpRequest;
import com.ajay.carrental.dto.request.SendOtpRequest;
import com.ajay.carrental.dto.response.CustomerResponse;
import com.ajay.carrental.dto.response.OtpResponse;
import com.ajay.carrental.security.JwtService;
import com.ajay.carrental.service.AuthenticationService;
import com.ajay.carrental.service.CustomerService;
import com.ajay.carrental.notification.NotificationDestination;
import com.ajay.carrental.enums.OtpChannel;
import com.ajay.carrental.notification.OtpDeliveryFactory;
import com.ajay.carrental.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final String ADMIN_EMAIL = "admin@carrental.com";

    private final OtpDeliveryFactory otpDeliveryFactory;
    private final OtpService otpService;
    private final CustomerService customerService;
    private final JwtService jwtService;

    @Override
    public OtpResponse sendOtp(SendOtpRequest request) {

        try {
            NotificationDestination destination = NotificationDestination.builder()
                    .channel(request.getChannel())
                    .address(request.getAddress())
                    .build();
            String otp = otpService.generateOtp(destination.getAddress());
            otpDeliveryFactory.getDeliveryService(destination.getChannel())
                    .sendOtp(destination, otp);

            return OtpResponse.builder()
                    .message("OTP sent successfully to your email")
                    .success(true)
                    .build();

        } catch (RuntimeException ex) {
            log.error("Error while sending OTP to {}", request.getAddress(), ex);
            return OtpResponse.builder()
                    .message(ex.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    public LoginResponse verifyOtpAndLogin(OtpRequest request) {

        boolean valid = otpService.verifyOtp(request.getAddress(),request.getOtp());
        if (!valid) {
            throw new RuntimeException("Invalid OTP");
        }

        CustomerResponse customer = customerService.getCustomerByEmail(request.getAddress());
        String role = ADMIN_EMAIL.equalsIgnoreCase(request.getAddress()) ? "ADMIN" : "CUSTOMER";
        String token = jwtService.generateToken(request.getAddress(), role);

        return LoginResponse.builder()
                .token(token)
                .role(role)
                .customerName(customer.getName())
                .email(request.getAddress())
                .build();
    }
}
