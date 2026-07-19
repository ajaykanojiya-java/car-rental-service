package com.ajay.carrental.config;

import com.ajay.carrental.security.JwtAuthenticationFilter;
import com.ajay.carrental.security.UnauthorizedEntryPoint;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UnauthorizedEntryPoint unauthorizedEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // OTP APIs
                        .requestMatchers("/api/v1/auth/send-otp","/api/v1/auth/verify-otp","/actuator/**")
                        .permitAll()

                        // Swagger
                        .requestMatchers("/swagger-ui/**","/v3/api-docs/**","/swagger-ui.html")
                        .permitAll()

                        // Everything else
                        .anyRequest()
                        .authenticated()
                ).exceptionHandling(exception ->
                        exception.authenticationEntryPoint(unauthorizedEntryPoint))

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}