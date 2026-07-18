package com.ajay.carrental.service.impl;

import com.ajay.carrental.service.OtpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Slf4j
@Service
public class OtpServiceImpl implements OtpService {

    private static class OtpData {
        String otp;
        long createdAt;
        int attemptCount;

        OtpData(String otp) {
            this.otp = otp;
            this.createdAt = System.currentTimeMillis();
            this.attemptCount = 0;
        }

        boolean isExpired(long expirationTimeMs) {
            return System.currentTimeMillis() - createdAt > expirationTimeMs;
        }

        boolean isMaxAttemptsExceeded(int maxAttempts) {
            return attemptCount >= maxAttempts;
        }
    }

    // Stores email -> OTP with metadata (expiration and attempt tracking)
    // TODO: Replace with Redis for production scalability and distributed cache
    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.otp.expiration-time-ms:300000}")
    private long otpExpirationTimeMs;

    @Value("${app.otp.max-verification-attempts:3}")
    private int maxVerificationAttempts;

    @Value("${app.otp.max-generation-attempts:5}")
    private int maxGenerationAttempts;

    @Override
    public String generateOtp(String email) {
        // Check if user already has an OTP and is trying to generate too many
        if (otpCache.containsKey(email)) {
            OtpData existingOtp = otpCache.get(email);
            if (existingOtp.attemptCount >= maxGenerationAttempts) {
                log.warn("Max OTP generation attempts exceeded for email: {}", email);
                throw new RuntimeException("Too many OTP requests. Please try again later.");
            }
        }

        int otpInt = 100000 + secureRandom.nextInt(900000); // 6-digit OTP
        String otp = String.valueOf(otpInt);
        otpCache.put(email, new OtpData(otp));
        log.info("OTP generated for email: {}", email);
        return otp;
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        if (!otpCache.containsKey(email)) {
            log.warn("No OTP found for email: {}", email);
            return false;
        }

        OtpData otpData = otpCache.get(email);

        // Check if OTP is expired
        if (otpData.isExpired(otpExpirationTimeMs)) {
            otpCache.remove(email);
            log.warn("OTP expired for email: {}", email);
            return false;
        }

        // Check if max verification attempts exceeded
        if (otpData.isMaxAttemptsExceeded(maxVerificationAttempts)) {
            otpCache.remove(email);
            log.warn("Max verification attempts exceeded for email: {}", email);
            throw new RuntimeException("Max verification attempts exceeded. Please request a new OTP.");
        }

        otpData.attemptCount++;

        // Verify OTP
        if (otpData.otp.equals(otp)) {
            otpCache.remove(email);
            log.info("OTP verified successfully for email: {}", email);
            return true;
        }

        log.warn("Invalid OTP attempt for email: {}, attempts: {}/{}", email, otpData.attemptCount, maxVerificationAttempts);
        return false;
    }

    @Override
    public void cleanupExpiredOtps() {
        otpCache.entrySet().removeIf(entry -> entry.getValue().isExpired(otpExpirationTimeMs));
        log.debug("Cleaned up expired OTPs");
    }
}
