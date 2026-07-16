import {
  Container,
  Typography,
} from "@mui/material";

import ReservationForm from "../../components/reservation/ReservationForm";

const ReservationPage = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Create Reservation
      </Typography>

      <ReservationForm />
    </Container>
  );
};

export default ReservationPage;