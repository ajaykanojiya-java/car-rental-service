package com.ajay.carrental.notification;

import com.ajay.carrental.enums.OtpChannel;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class OtpDeliveryFactory {

    private final Map<OtpChannel, OtpDeliveryService> deliveryServices;

    public OtpDeliveryFactory(List<OtpDeliveryService> services) {

        this.deliveryServices = new EnumMap<>(OtpChannel.class);
        services.forEach(service -> this.deliveryServices.put(service.getChannel(), service));
    }

    public OtpDeliveryService getDeliveryService(OtpChannel channel) {

        OtpDeliveryService service = deliveryServices.get(channel);
        if (service == null) {
            throw new IllegalArgumentException(
                    "No OTP delivery service registered for channel: " + channel
            );
        }

        return service;
    }
}
