package com.ajay.carrental.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpResponse {
    private String message;
    private boolean success;
}
