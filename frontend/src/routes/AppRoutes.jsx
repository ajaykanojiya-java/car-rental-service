import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import PricingPage from "../pages/pricing/PricingPage";
import CreateReservationPage from "../pages/reservations/CreateReservationPage";
import ReservationManagementPage from "../pages/reservations/ReservationManagementPage";

import ROUTES from "../constants/routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
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
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;