import { useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
} from "@mui/material";

import PricingForm from "../../components/pricing/PricingForm";
import PricingResults from "../../components/pricing/PricingResults";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import PageSection from "../../components/common/PageSection";

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
        <PageContainer>

            <PageHeader
                title="Pricing Calculator"
                subtitle="Estimate rental pricing before creating a reservation."
            />

            <PageSection>

                <PricingForm
                    onCalculate={calculatePricing}
                    loading={loading}
                />

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3,
                            mb: 3,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                <PricingResults pricing={pricing} />

            </PageSection>

        </PageContainer>
    );
};

export default PricingPage;