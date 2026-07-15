import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import PricingPage from "../pages/pricing/PricingPage";
import ROUTES from "../constants/routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          <Route
            path={ROUTES.PRICING}
            element={<PricingPage />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;