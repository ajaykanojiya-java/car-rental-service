package com.ajay.carrental.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequest {
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is mandatory")
    private String email;
    
    @NotBlank(message = "OTP is mandatory")
    private String otp;
}

