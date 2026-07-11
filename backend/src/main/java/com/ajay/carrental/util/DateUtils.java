package com.ajay.carrental.util;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

public final class DateUtils {

    private DateUtils() {
    }

    public static int getRentalDays(LocalDate startDate, LocalDate endDate) {
        return (int) ChronoUnit.DAYS.between(startDate, endDate);
    }

    public static int getLicenseYears(LocalDate licenseIssueDate) {
        return Period.between(licenseIssueDate, LocalDate.now())
                .getYears();
    }
}