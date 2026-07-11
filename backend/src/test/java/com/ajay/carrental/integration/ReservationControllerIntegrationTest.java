package com.ajay.carrental.integration;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ReservationControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReserveVehicle() throws Exception {

        String request = """
                {
                  "customerName":"Ajay",
                  "vehicleCategory":"SUV",
                  "startDate":"2026-07-20",
                  "endDate":"2026-07-25",
                  "dailyMileage":40,
                  "licenseYears":5
                }
                """;

        mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerName").value("Ajay"))
                .andExpect(jsonPath("$.category").value("SUV"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void shouldCancelReservation() throws Exception {

        String request = """
                {
                  "customerName":"Rohit",
                  "vehicleCategory":"SEDAN",
                  "startDate":"2026-07-20",
                  "endDate":"2026-07-25",
                  "dailyMileage":20,
                  "licenseYears":5
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isCreated())
                .andReturn();

        String reservationId = JsonPath.read(
                result.getResponse().getContentAsString(),
                "$.reservationId");

        mockMvc.perform(delete("/api/v1/reservations/" + reservationId))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn400WhenCustomerNameMissing() throws Exception {

        String request = """
                {
                  "vehicleCategory":"SUV",
                  "startDate":"2026-07-20",
                  "endDate":"2026-07-25",
                  "dailyMileage":20,
                  "licenseYears":5
                }
                """;

        mockMvc.perform(post("/api/v1/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn404WhenReservationNotFound() throws Exception {

        mockMvc.perform(delete(
                        "/api/v1/reservations/11111111-1111-1111-1111-111111111111"))
                .andExpect(status().isNotFound());
    }
}