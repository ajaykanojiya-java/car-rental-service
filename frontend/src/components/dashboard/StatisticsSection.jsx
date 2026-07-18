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
import useAuth from "../../hooks/useAuth";
import { CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material";


const StatisticsSection = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { role, email } = useAuth();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
          await dashboardService.getDashboardSummary(
              role,
              email
          );

      if (role === "ADMIN") {
          setStatistics([
              {
                  title: "Total Cars",
                  value: data.totalCars,
                  icon: <DirectionsCarFilled color="primary" />,
              },
              {
                  title: "Available Cars",
                  value: data.availableCars,
                  icon: <CheckCircleOutlineIcon color="success" />,
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
                  title: "Total Amount",
                  value: data.totalAmount,
                  icon: <CurrencyRupee color="primary" />,
              },
          ]);
      } else {
          setStatistics([
              {
                  title: "My Reservations",
                  value: data.reservations,
                  icon: <CalendarMonth color="primary" />,
              },
              {
                  title: "My Active Rentals",
                  value: data.activeRentals,
                  icon: <CarRental color="primary" />,
              },
              {
                  title: "Total Amount",
                  value: data.totalAmount,
                  icon: <CurrencyRupee color="primary" />,
              },
          ]);
      }
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
  }, [
      location.state?.refresh,
      role,
      email,
  ]);

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
                md: role === "ADMIN" ? 4 : 4,
                lg: role === "ADMIN" ? 2.4 : 4,
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