package com.ajay.carrental.controller;

import com.ajay.carrental.dto.request.OtpRequest;
import com.ajay.carrental.dto.request.SendOtpRequest;
import com.ajay.carrental.dto.response.OtpResponse;
import com.ajay.carrental.service.EmailService;
import com.ajay.carrental.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final EmailService emailService;
    private final OtpService otpService;

    /**
     * Send OTP to the provided email address.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        try {
            emailService.sendOtpEmail(request.getEmail());
            log.info("OTP sent successfully to: {}", request.getEmail());
            return ResponseEntity.ok(OtpResponse.builder()
                            .message("OTP sent successfully to your email")
                            .success(true)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error sending OTP to: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(OtpResponse.builder()
                            .message("Failed to send OTP. Please try again later.")
                            .success(false)
                            .build()
                    );
        }
    }

    /**
     * Verify the OTP provided by user.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<OtpResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        try {
            boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
            
            if (isValid) {
                log.info("OTP verified successfully for: {}", request.getEmail());
                return ResponseEntity.ok(
                        OtpResponse.builder()
                                .message("OTP verified successfully")
                                .success(true)
                                .build()
                );
            } else {
                log.warn("Invalid OTP provided for: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(OtpResponse.builder()
                                .message("Invalid OTP. Please try again.")
                                .success(false)
                                .build()
                        );
            }
        } catch (RuntimeException e) {
            log.error("Error verifying OTP for: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(OtpResponse.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build()
                    );
        }
    }
}
