package com.ajay.carrental.notification;

import com.ajay.carrental.enums.OtpChannel;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class NotificationDestination {

    //Delivery channel.
    OtpChannel channel;

    //Email address, mobile number, device token, etc.
    String address;
}