import { Container, Grid, Typography } from "@mui/material";
import StatisticsCard from "../../components/dashboard/StatisticsCard";

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatisticsCard
            title="Total Cars"
            value="120"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatisticsCard
            title="Reservations"
            value="45"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatisticsCard
            title="Active Rentals"
            value="18"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatisticsCard
            title="Revenue"
            value="₹2,45,000"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;