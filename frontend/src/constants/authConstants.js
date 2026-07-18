/**
 * Authentication Constants
 * -----------------------------------------
 * Central location for authentication-related
 * constants used across the application.
 */

// User Roles
export const USER_ROLES = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_SESSION: "car-rental-auth-session",
};

// Admin Hash Key
// NOTE:
// For this interview project, the hash is validated
// on the frontend as requested.
// Later this can be moved to an environment variable.
export const ADMIN_HASH_KEY = "ADMIN@2026";

// Session Status
export const AUTH_STATUS = {
    AUTHENTICATED: true,
    UNAUTHENTICATED: false,
};