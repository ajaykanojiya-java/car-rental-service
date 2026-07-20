package com.ajay.carrental.notification.impl;

import com.ajay.carrental.notification.NotificationDestination;
import com.ajay.carrental.enums.OtpChannel;
import com.ajay.carrental.notification.OtpDeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailOtpDeliveryServiceImpl implements OtpDeliveryService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.otp.expiration-time-minutes:5}")
    private int expirationTimeMinutes;

    @Override
    public OtpChannel getChannel() {
        return OtpChannel.EMAIL;
    }

    @Override
    public void sendOtp(NotificationDestination destination, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(destination.getAddress());
        message.setSubject("Your Car Rental OTP Verification Code");
        message.setText(buildEmailContent(otp));

        try {
            mailSender.send(message);
            log.info("OTP email sent successfully to {}",destination.getAddress());
        } catch (MailException ex) {
            log.error("Failed to send OTP email to {}",destination.getAddress(), ex);
            throw new RuntimeException("Failed to send OTP email. Please try again later.",ex);
        }
    }

    private String buildEmailContent(String otp) {
        return """
                Your Car Rental Verification Code
                Your OTP for authentication is: %s
                This code will expire in %d minutes.
                If you did not request this OTP, please ignore this email.
                Note: Never share your OTP with anyone.
                Best regards,
                Car Rental Service Team
                """.formatted(otp, expirationTimeMinutes);
    }
}