package com.ajay.carrental.dto.response;

import com.ajay.carrental.enums.VehicleCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Represents the calculated rental option for a vehicle category.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingResponse {

    private VehicleCategory category;

    private BigDecimal totalAmount;
}