package com.ajay.carrental.service;

import com.ajay.carrental.dto.auth.LoginResponse;
import com.ajay.carrental.dto.request.OtpRequest;
import com.ajay.carrental.dto.request.SendOtpRequest;
import com.ajay.carrental.dto.response.OtpResponse;

public interface AuthenticationService {

    OtpResponse sendOtp(SendOtpRequest request);

    LoginResponse verifyOtpAndLogin(OtpRequest request);

}
