package com.ajay.carrental.service.impl;

import com.ajay.carrental.dto.response.CustomerResponse;
import com.ajay.carrental.entity.Customer;
import com.ajay.carrental.repository.CustomerRepository;
import com.ajay.carrental.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public Customer getOrCreateCustomer(String name, String email, int licenseYears) {

        return customerRepository.findByEmail(email)
                .orElseGet(() -> createCustomer(name, email, licenseYears));
    }

    @Override
    public CustomerResponse getCustomerByEmail(String email) {

        return customerRepository.findByEmail(email)
                .map(this::toCustomerResponse)
                .orElseGet(() -> CustomerResponse.builder()
                        .email(email)
                        .build());
    }

    private Customer createCustomer(String name, String email, int licenseYears) {

        Customer customer = Customer.builder()
                .name(name)
                .email(email)
                .licenseIssueDate(LocalDate.now().minusYears(licenseYears))
                .build();
        return customerRepository.save(customer);
    }

    private CustomerResponse toCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .licenseIssueDate(customer.getLicenseIssueDate())
                .build();
    }
}
