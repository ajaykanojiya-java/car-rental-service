package com.ajay.carrental.controller;

import com.ajay.carrental.dto.auth.LoginResponse;
import com.ajay.carrental.dto.request.OtpRequest;
import com.ajay.carrental.dto.request.SendOtpRequest;
import com.ajay.carrental.dto.response.OtpResponse;
import com.ajay.carrental.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    /**
     * Send OTP to the provided email address.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        return ResponseEntity.ok(authenticationService.sendOtp(request));
    }

    /**
     * Verify the OTP provided by user.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {

        return ResponseEntity.ok(
                authenticationService.verifyOtpAndLogin(request)
        );
    }
}
