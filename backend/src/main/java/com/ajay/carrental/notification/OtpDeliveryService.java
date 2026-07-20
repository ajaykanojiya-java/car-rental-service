package com.ajay.carrental.notification;

import com.ajay.carrental.enums.OtpChannel;

public interface OtpDeliveryService {

    //Returns the channel supported by this implementation.
    OtpChannel getChannel();

    //Sends the OTP to the specified destination.
    void sendOtp(NotificationDestination destination, String otp);
}
