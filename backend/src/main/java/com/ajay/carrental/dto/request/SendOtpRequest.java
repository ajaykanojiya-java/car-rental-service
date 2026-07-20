package com.ajay.carrental.dto.request;

import com.ajay.carrental.enums.OtpChannel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {

    @NotBlank
    private String address;

    @NotNull
    private OtpChannel channel;
}
