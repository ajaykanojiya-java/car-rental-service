package com.ajay.carrental.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is mandatory")
    private String email;
}
