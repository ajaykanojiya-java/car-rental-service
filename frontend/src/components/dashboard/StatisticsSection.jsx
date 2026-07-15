import { useEffect, useState } from "react";

import {
  Alert,
  CircularProgress,
  Grid,
  Box,
} from "@mui/material";

import {
  DirectionsCarFilled,
  CalendarMonth,
  CarRental,
  CurrencyRupee,
} from "@mui/icons-material";

import dashboardService from "../../services/dashboardService";
import StatisticsCard from "./StatisticsCard";

const StatisticsSection = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await dashboardService.getDashboardSummary();

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
      setError("Unable to load dashboard.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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