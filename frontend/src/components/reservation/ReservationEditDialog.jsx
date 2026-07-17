import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const ReservationEditDialog = ({
  open,
  reservation,
  loading = false,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    dailyMileage: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reservation) {
      setFormData({
        startDate: reservation.startDate
          ? reservation.startDate.substring(0, 10)
          : "",
        endDate: reservation.endDate
          ? reservation.endDate.substring(0, 10)
          : "",
        dailyMileage:
          reservation.dailyMileage ?? "",
      });

      setErrors({});
    }
  }, [reservation]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.startDate) {
      validationErrors.startDate =
        "Start Date is required.";
    }

    if (!formData.endDate) {
      validationErrors.endDate =
        "End Date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <
        new Date(formData.startDate)
    ) {
      validationErrors.endDate =
        "End Date cannot be before Start Date.";
    }

    if (
      formData.dailyMileage === "" ||
      formData.dailyMileage === null
    ) {
      validationErrors.dailyMileage =
        "Daily Mileage is required.";
    } else if (
      Number(formData.dailyMileage) <= 0
    ) {
      validationErrors.dailyMileage =
        "Daily Mileage must be greater than zero.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length ===
      0
    );
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    onSave({
      startDate: formData.startDate,
      endDate: formData.endDate,
      dailyMileage: Number(formData.dailyMileage),
    });
  };

  const handleClose = () => {
    if (!loading) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Edit Reservation
      </DialogTitle>

      <DialogContent dividers>
        {!reservation ? null : (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Customer Name"
                  value={
                    reservation.customerName
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Customer Email"
                  value={
                    reservation.customerEmail
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Vehicle Number"
                  value={
                    reservation.vehicleNumber
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Vehicle Category"
                  value={reservation.category.replaceAll(
                    "_",
                    " "
                  )}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              Editable Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={
                    formData.startDate
                  }
                  onChange={
                    handleChange
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={
                    !!errors.startDate
                  }
                  helperText={
                    errors.startDate
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={
                    formData.endDate
                  }
                  onChange={
                    handleChange
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={
                    !!errors.endDate
                  }
                  helperText={
                    errors.endDate
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Daily Mileage"
                  name="dailyMileage"
                  type="number"
                  value={
                    formData.dailyMileage
                  }
                  onChange={
                    handleChange
                  }
                  fullWidth
                  error={
                    !!errors.dailyMileage
                  }
                  helperText={
                    errors.dailyMileage
                  }
                />
              </Grid>
            </Grid>
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          variant="outlined"
          disabled={loading}
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSave}
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : null
          }
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationEditDialog;