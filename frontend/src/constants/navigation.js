import {
    CalendarMonth,
    CurrencyRupee,
    Dashboard,
} from "@mui/icons-material";

import ROUTES from "./routes";
import { USER_ROLES } from "./authConstants";

export const NAVIGATION = {
    [USER_ROLES.ADMIN]: [
        {
            label: "Dashboard",
            route: ROUTES.DASHBOARD,
            icon: Dashboard,
        },
        {
            label: "Pricing",
            route: ROUTES.PRICING,
            icon: CurrencyRupee,
        },
        {
            label: "Reservations",
            route: ROUTES.RESERVATIONS,
            icon: CalendarMonth,
        },
    ],

    [USER_ROLES.CUSTOMER]: [
        {
            label: "Dashboard",
            route: ROUTES.DASHBOARD,
            icon: Dashboard,
        },
        {
            label: "Pricing",
            route: ROUTES.PRICING,
            icon: CurrencyRupee,
        },
        {
            label: "My Reservations",
            route: ROUTES.RESERVATIONS,
            icon: CalendarMonth,
        },
    ],
};