import { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

const PricingForm = ({ onCalculate, loading }) => {
  const [formData, setFormData] = useState({
    rentalDays: 1,
    dailyMileage: 50,
    licenseYears: 2,
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onCalculate({
      rentalDays: Number(formData.rentalDays),
      dailyMileage: Number(formData.dailyMileage),
      licenseYears: Number(formData.licenseYears),
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Stack spacing={3}>
          <TextField
            label="Rental Days"
            name="rentalDays"
            type="number"
            value={formData.rentalDays}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Daily Mileage"
            name="dailyMileage"
            type="number"
            value={formData.dailyMileage}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="License Years"
            name="licenseYears"
            type="number"
            value={formData.licenseYears}
            onChange={handleChange}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            Calculate Pricing
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default PricingForm;