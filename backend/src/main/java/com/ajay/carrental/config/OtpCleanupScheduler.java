package com.ajay.carrental.config;

import com.ajay.carrental.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class OtpCleanupScheduler {

    private final OtpService otpService;

    /**
     * Cleanup expired OTPs every minute
     */
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredOtps() {
        log.debug("Running OTP cleanup task");
        otpService.cleanupExpiredOtps();
    }
}
