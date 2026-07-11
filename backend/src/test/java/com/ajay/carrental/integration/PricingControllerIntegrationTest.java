package com.ajay.carrental.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PricingControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnPricingOptions() throws Exception {

        String request = """
                {
                  "rentalDays":12,
                  "dailyMileage":50,
                  "licenseYears":2
                }
                """;

        mockMvc.perform(post("/api/v1/pricing/options")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].category").exists())
                .andExpect(jsonPath("$[0].totalAmount").exists());
    }
}