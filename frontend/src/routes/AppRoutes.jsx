import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../components/auth/LoginPage";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import PricingPage from "../pages/pricing/PricingPage";
import CreateReservationPage from "../pages/reservations/CreateReservationPage";
import ReservationManagementPage from "../pages/reservations/ReservationManagementPage";

import ROUTES from "../constants/routes";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public Routes */}

                    <Route
                        path={ROUTES.LOGIN}
                        element={<LoginPage />}
                    />

                    {/* Protected Routes */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<MainLayout />}>

                            <Route
                                path="/"
                                element={
                                    <Navigate
                                        to={ROUTES.DASHBOARD}
                                        replace
                                    />
                                }
                            />

                            <Route
                                path={ROUTES.DASHBOARD}
                                element={<Dashboard />}
                            />

                            <Route
                                path={ROUTES.PRICING}
                                element={<PricingPage />}
                            />

                            <Route
                                path={ROUTES.RESERVATIONS}
                                element={<ReservationManagementPage />}
                            />

                            <Route
                                path={ROUTES.CREATE_RESERVATION}
                                element={<CreateReservationPage />}
                            />

                        </Route>

                    </Route>

                    {/* Unknown Routes */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;