import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";

import {
  CalendarMonth,
  CarRental,
  CurrencyRupee,
  DirectionsCarFilled,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import dashboardService from "../../services/dashboardService";
import ROUTES from "../../constants/routes";
import StatisticsCard from "./StatisticsCard";

const StatisticsSection = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await dashboardService.getDashboardSummary();

      setStatistics([
        {
          title: "Total Cars",
          value: data.totalCars,
          icon: <DirectionsCarFilled color="primary" />,
        },
        {
          title: "Reservations",
          value: data.reservations,
          icon: <CalendarMonth color="primary" />,
        },
        {
          title: "Active Rentals",
          value: data.activeRentals,
          icon: <CarRental color="primary" />,
        },
        {
          title: "Revenue",
          value: data.revenue,
          icon: <CurrencyRupee color="primary" />,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    if (location.state?.refresh) {
      navigate(ROUTES.DASHBOARD, {
        replace: true,
        state: null,
      });
    }
  }, [location.state?.refresh]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {statistics.map((stat) => (
        <Grid
          key={stat.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatisticsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsSection;