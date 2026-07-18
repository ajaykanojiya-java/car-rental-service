package com.ajay.carrental.service.impl;

import com.ajay.carrental.service.EmailService;
import com.ajay.carrental.service.OtpService;
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
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final OtpService otpService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.otp.expiration-time-minutes:5}")
    private int expirationTimeMinutes;

    @Override
    public void sendOtpEmail(String toEmail) {
        String otp = otpService.generateOtp(toEmail);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your Car Rental OTP Verification Code");
        message.setText(buildEmailContent(otp));

        try {
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (MailException e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email. Please try again later.", e);
        }
    }

    private String buildEmailContent(String otp) {
        return "Your Car Rental Verification Code\n\n" +
                "Your OTP for authentication is: " + otp + "\n\n" +
                "This code will expire in " + expirationTimeMinutes + " minutes.\n\n" +
                "If you did not request this OTP, please ignore this email.\n\n" +
                "Note: Never share your OTP with anyone.\n\n" +
                "Best regards,\n" +
                "Car Rental Service Team";
    }
}
