import { useState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import reservationService from "../../services/reservationService";
import ReservationConfirmationDialog from "./ReservationConfirmationDialog";

const initialForm = {
  customerName: "",
  vehicleCategory: "",
  startDate: "",
  endDate: "",
  dailyMileage: "",
  licenseYears: "",
};

const ReservationForm = () => {
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [reservation, setReservation] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response =
        await reservationService.createReservation({
          ...formData,
          dailyMileage: Number(formData.dailyMileage),
          licenseYears: Number(formData.licenseYears),
        });

      setReservation(response);

      setDialogOpen(true);

      setFormData(initialForm);
    } catch (err) {
      console.error(err);
      setError("Unable to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              select
              label="Vehicle Category"
              name="vehicleCategory"
              value={formData.vehicleCategory}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="SEDAN">Sedan</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="VAN">Van</MenuItem>
              <MenuItem value="PICKUP_TRUCK">
                Pickup Truck
              </MenuItem>
            </TextField>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="date"
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="date"
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Daily Mileage"
                  name="dailyMileage"
                  type="number"
                  value={formData.dailyMileage}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="License Years"
                  name="licenseYears"
                  type="number"
                  value={formData.licenseYears}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Create Reservation"
              )}
            </Button>

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>

      <ReservationConfirmationDialog
        open={dialogOpen}
        reservation={reservation}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ReservationForm;