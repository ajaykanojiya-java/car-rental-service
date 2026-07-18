import { createContext, useEffect, useMemo, useState } from "react";
import {
    ADMIN_HASH_KEY,
    AUTH_STATUS,
    USER_ROLES,
} from "../constants/authConstants";
import {
    clearSession,
    getSession,
    saveSession,
} from "../utils/authStorage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Restore authentication session
     * when the application loads.
     */
    useEffect(() => {
        const session = getSession();

        if (session?.authenticated) {
            setUser(session);
        }

        setLoading(false);
    }, []);

    /**
     * Admin Login
     *
     * @param {string} hashKey
     * @returns {boolean}
     */
    const loginAsAdmin = (hashKey) => {
        if (hashKey !== ADMIN_HASH_KEY) {
            return false;
        }

        const session = {
            authenticated: AUTH_STATUS.AUTHENTICATED,
            role: USER_ROLES.ADMIN,
            email: null,
            displayName: "ADMIN",
            customerExists: false,
            loginTime: new Date().toISOString(),
        };

        saveSession(session);
        setUser(session);

        return true;
    };

    /**
     * Customer Login
     *
     * Placeholder for Sprint 4.2.
     */
    const loginAsCustomer = ({
        email,
        displayName,
        customerExists,
    }) => {
        const session = {
            authenticated: AUTH_STATUS.AUTHENTICATED,
            role: USER_ROLES.CUSTOMER,
            email,
            displayName,
            customerExists,
            loginTime: new Date().toISOString(),
        };

        saveSession(session);
        setUser(session);
    };

    /**
     * Logout
     */
    const logout = () => {
        clearSession();
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,

            loading,

            isAuthenticated: !!user,

            role: user?.role ?? null,

            email: user?.email ?? null,

            displayName:
                user?.displayName ?? "",

            customerExists:
                user?.customerExists ?? false,

            loginAsAdmin,

            loginAsCustomer,

            logout,
        }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};