package com.ajay.carrental.service;

import com.ajay.carrental.dto.response.CustomerResponse;
import com.ajay.carrental.entity.Customer;

public interface CustomerService {

    Customer getOrCreateCustomer(String name, String email, int licenseYears);

    CustomerResponse getCustomerByEmail(String email);

}
