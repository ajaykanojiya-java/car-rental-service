import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";
import customerService from "../../services/customerService";

import useAuth from "../../hooks/useAuth";
import ROUTES from "../../constants/routes";

const CustomerLoginForm = () => {
    console.log("CustomerLoginForm rendered");
    const navigate = useNavigate();

    const { loginAsCustomer } = useAuth();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [customerInfo, setCustomerInfo] =
        useState(null);

    const handleGetOtp = async (event) => {
        console.log(">>> handleGetOtp called");
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            let customer;

            try {
                customer =
                    await customerService.getCustomerByEmail(
                        email
                    );

                setCustomerInfo({
                    email: customer.email,
                    displayName: customer.name,
                    customerExists: true,
                });
            } catch (err) {
                if (err.response?.status === 404 || err.response?.status === 401) {
                    setCustomerInfo({
                        email,
                        displayName: email,
                        customerExists: false,
                    });
                } else {
                    throw err;
                }
            }

            const response =
                await authService.sendOtp(email);

            if (response.success) {
                setOtpSent(true);
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error(err);

            setError(
                "Unable to send OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (event) => {
         console.log(">>> handleVerifyOtp called");
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const loginResponse =
                await authService.verifyOtp(
                    email,
                    otp
                );
            console.log("STEP 1 - Login Response:", loginResponse);

            // Store authenticated session (JWT + user details)
            authService.login(loginResponse);

            console.log(
                "STEP 2 - JWT Storage:",
                localStorage.getItem("car_rental_auth")
            );

            // Update AuthContext
            loginAsCustomer({
                email: loginResponse.email,
                displayName:
                    loginResponse.customerName ||
                    loginResponse.email,
                customerExists:
                    !!loginResponse.customerName,
            });

            console.log(
                "STEP 3 - Session Storage:",
                localStorage.getItem("car-rental-auth-session")
            );

            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            console.error(err);

            setError(
                "Invalid OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={
                otpSent
                    ? handleVerifyOtp
                    : handleGetOtp
            }
            noValidate
        >
            <Stack spacing={3}>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Enter your email address to receive
                    a One-Time Password (OTP).
                </Typography>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={email}
                    disabled={otpSent}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                />

                {otpSent && (
                    <TextField
                        label="OTP"
                        fullWidth
                        value={otp}
                        onChange={(event) =>
                            setOtp(
                                event.target.value
                            )
                        }
                    />
                )}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress
                            size={24}
                            color="inherit"
                        />
                    ) : otpSent ? (
                        "Verify OTP"
                    ) : (
                        "Get OTP Test"
                    )}
                </Button>

            </Stack>
        </Box>
    );
};

export default CustomerLoginForm;