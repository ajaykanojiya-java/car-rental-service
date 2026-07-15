import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";

function AppRoutes() {

    return (

        <BrowserRouter>

            <MainLayout>

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                </Routes>

            </MainLayout>

        </BrowserRouter>

    );

}

export default AppRoutes;