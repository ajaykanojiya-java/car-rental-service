import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ROUTES from "../../constants/routes";

const ReservationConfirmationDialog = ({
  open,
  reservation,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!reservation) {
    return null;
  }

  const handleDashboard = () => {
    onClose();

    navigate(ROUTES.DASHBOARD, {
      state: {
        refresh: true,
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Reservation Created Successfully
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography>
            <strong>Reservation ID</strong>
            <br />
            {reservation.reservationId}
          </Typography>

          <Divider />

          <Typography>
            <strong>Customer</strong>
            <br />
            {reservation.customerName}
          </Typography>

          <Typography>
            <strong>Vehicle Number</strong>
            <br />
            {reservation.vehicleNumber}
          </Typography>

          <Typography>
            <strong>Category</strong>
            <br />
            {reservation.category}
          </Typography>

          <Typography>
            <strong>Total Amount</strong>
            <br />
            ₹{reservation.totalAmount}
          </Typography>

          <Typography>
            <strong>Status</strong>
            <br />
            {reservation.status}
          </Typography>

          <Typography>
            <strong>Rental Period</strong>
            <br />
            {reservation.startDate} → {reservation.endDate}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Create Another
        </Button>

        <Button
          variant="contained"
          onClick={handleDashboard}
        >
          Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationConfirmationDialog;