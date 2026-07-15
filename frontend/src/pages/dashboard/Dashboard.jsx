import {
  Container,
  Typography,
} from "@mui/material";

import StatisticsSection from "../../components/dashboard/StatisticsSection";

const Dashboard = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Dashboard
      </Typography>

      <StatisticsSection />
    </Container>
  );
};

export default Dashboard;