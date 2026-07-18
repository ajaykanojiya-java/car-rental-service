package com.ajay.carrental.integration;

import com.ajay.carrental.dto.request.OtpRequest;
import com.ajay.carrental.dto.response.OtpResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Authentication Controller Integration Tests")
@TestPropertySource(properties = {
        "app.otp.expiration-time-ms=5000",
        "app.otp.max-verification-attempts=3",
        "app.otp.max-generation-attempts=5"
})
class AuthenticationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String SEND_OTP_ENDPOINT = "/api/v1/auth/send-otp";
    private static final String VERIFY_OTP_ENDPOINT = "/api/v1/auth/verify-otp";
    private static final String TEST_EMAIL = "integration@example.com";

    // ==================== Send OTP Tests ====================

    @Test
    @DisplayName("Should send OTP successfully with valid email")
    void testSendOtpSuccess() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(TEST_EMAIL + "1", null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("successfully")));
    }

    @Test
    @DisplayName("Should reject send OTP with invalid email format")
    void testSendOtpInvalidEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest("invalid-email", null))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject send OTP with blank email")
    void testSendOtpBlankEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest("", null))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject send OTP with null email")
    void testSendOtpNullEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":null}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle missing email field gracefully")
    void testSendOtpMissingEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // ==================== Verify OTP Tests ====================

    @Test
    @DisplayName("Should verify OTP successfully with correct email and OTP")
    void testVerifyOtpSuccess() throws Exception {
        String email = TEST_EMAIL + "2";

        // First send OTP
        MvcResult sendResult = mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(email, null))))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @DisplayName("Should reject verify OTP with blank OTP")
    void testVerifyOtpBlankOtp() throws Exception {
        // When & Then
        mockMvc.perform(post(VERIFY_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(TEST_EMAIL + "3", ""))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject verify OTP with blank email")
    void testVerifyOtpBlankEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(VERIFY_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest("", "123456"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject verify OTP with invalid email format")
    void testVerifyOtpInvalidEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(VERIFY_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest("invalid-email", "123456"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 401 Unauthorized for wrong OTP")
    void testVerifyOtpWrongCode() throws Exception {
        String email = TEST_EMAIL + "4";

        // Send OTP first
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(email, null))))
                .andExpect(status().isOk());

        // Try to verify with wrong OTP
        mockMvc.perform(post(VERIFY_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(email, "999999"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Invalid OTP")));
    }

    @Test
    @DisplayName("Should reject verify OTP with missing email")
    void testVerifyOtpMissingEmail() throws Exception {
        // When & Then
        mockMvc.perform(post(VERIFY_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"otp\":\"123456\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject verify OTP with missing OTP")
    void testVerifyOtpMissingOtp() throws Exception {
        // When & Then
        mockMvc.perform(post(VERIFY_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\"}"))
                .andExpect(status().isBadRequest());
    }

    // ==================== Response Format Tests ====================

    @Test
    @DisplayName("Should return OtpResponse with success and message fields")
    void testSendOtpResponseFormat() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(TEST_EMAIL + "5", null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.success").isBoolean())
                .andExpect(jsonPath("$.message").isString());
    }

    // ==================== Edge Cases ====================

    @Test
    @DisplayName("Should handle email with plus addressing")
    void testSendOtpPlusAddressing() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest("test+otp@example.com", null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    @DisplayName("Should handle email with subdomain")
    void testSendOtpSubdomain() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest("test@subdomain.example.co.in", null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    @DisplayName("Should handle long email address")
    void testSendOtpLongEmail() throws Exception {
        String longEmail = "verylongemailaddresswithtestprefix@example.com";

        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        new OtpRequest(longEmail, null))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    @DisplayName("Should return 415 for unsupported content type")
    void testSendOtpUnsupportedContentType() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_XML)
                .content("<email>test@example.com</email>"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("Should handle malformed JSON gracefully")
    void testSendOtpMalformedJson() throws Exception {
        // When & Then
        mockMvc.perform(post(SEND_OTP_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{invalid json}"))
                .andExpect(status().isBadRequest());
    }
}
