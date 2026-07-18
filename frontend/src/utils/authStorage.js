import { STORAGE_KEYS } from "../constants/authConstants";

/**
 * Save authenticated user session.
 *
 * @param {Object} session
 */
export const saveSession = (session) => {
    localStorage.setItem(
        STORAGE_KEYS.AUTH_SESSION,
        JSON.stringify(session)
    );
};

/**
 * Retrieve authenticated user session.
 *
 * @returns {Object|null}
 */
export const getSession = () => {
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);

    if (!session) {
        return null;
    }

    try {
        return JSON.parse(session);
    } catch (error) {
        console.error("Invalid authentication session.", error);
        clearSession();
        return null;
    }
};

/**
 * Remove authentication session.
 */
export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
};

/**
 * Returns true if a valid session exists.
 *
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    const session = getSession();

    return (
        session !== null &&
        session.authenticated === true
    );
};