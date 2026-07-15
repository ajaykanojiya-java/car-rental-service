import { useState } from "react";

import {
  Alert,
  CircularProgress,
  Container,
  Typography,
  Box,
} from "@mui/material";

import PricingForm from "../../components/pricing/PricingForm";
import PricingResults from "../../components/pricing/PricingResults";
import pricingService from "../../services/pricingService";

const PricingPage = () => {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculatePricing = async (request) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await pricingService.calculatePricing(request);

      setPricing(response);
    } catch (err) {
      console.error(err);
      setError("Unable to calculate pricing.");
    } finally {
      setLoading(false);
    }
  };

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
        Pricing Calculator
      </Typography>

      <PricingForm
        onCalculate={calculatePricing}
        loading={loading}
      />

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      <PricingResults pricing={pricing} />
    </Container>
  );
};

export default PricingPage;