import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ROUTES from "../../constants/routes";

/**
 * ProtectedRoute
 *
 * Restricts access to authenticated users only.
 *
 * Usage:
 *
 * <Route element={<ProtectedRoute />}>
 *     <Route path="ROUTES.DASHBOARD" element={<DashboardPage />} />
 * </Route>
 */
const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    /**
     * Wait until the authentication session
     * has been restored from localStorage.
     */
    if (loading) {
        return null;
    }

    /**
     * User is not authenticated.
     * Redirect to Login page.
     */
    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                replace
                state={{ from: location }}
            />
        );
    }

    /**
     * User authenticated.
     * Render requested route.
     */
    return <Outlet />;
};

export default ProtectedRoute;