package com.ajay.carrental.service;

public interface OtpService {
    String generateOtp(String email);
    
    boolean verifyOtp(String email, String otp);
    
    void cleanupExpiredOtps();
}
