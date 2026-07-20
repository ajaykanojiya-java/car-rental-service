import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
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
    const [otpChannel, setOtpChannel] = useState("EMAIL");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [customerInfo, setCustomerInfo] =
        useState(null);

    const handleGetOtp = async (event) => {
        console.log(">>> handleGetOtp called");
        event.preventDefault();

        const address = email.trim();
        if (!address) {
            setError("Email address is required.");
            return;
        }

        if (otpChannel === "SMS") {
            setError("SMS OTP is not supported yet. Please choose EMAIL.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await authService.sendOtp({
                    address,
                    channel: otpChannel,
                });

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

        const address = email.trim();
        if (!address) {
            setError("Email address is required.");
            return;
        }

        if (!otp.trim()) {
            setError("OTP is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const loginResponse =
                await authService.verifyOtp(
                    {
                        address,
                        otp: otp.trim(),
                    }
                );
            console.log("STEP 1 - Login Response:", loginResponse);

            // Store authenticated session (JWT + user details)
            authService.login(loginResponse);

            console.log(
                "STEP 2 - JWT Storage:",
                localStorage.getItem("car_rental_auth")
            );

            let customer;
            try {
                customer =
                    await customerService.getCustomerByEmail(
                        address
                    );
            } catch (profileError) {
                console.error(profileError);
                authService.logout();
                setError(
                    "Unable to load customer profile after login. Please try again."
                );
                return;
            }

            setCustomerInfo({
                email: customer.email,
                displayName:
                    customer.name || loginResponse.customerName || address,
                customerExists: !!customer.name,
            });

            // Update AuthContext
            loginAsCustomer({
                email: customer.email || loginResponse.email,
                displayName:
                    customer.name ||
                    loginResponse.customerName ||
                    address,
                customerExists: !!customer.name,
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
                    Choose your OTP channel and enter
                    your address.
                </Typography>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <FormControl
                    fullWidth
                    disabled={otpSent}
                >
                    <InputLabel id="otp-channel-label">
                        OTP Channel
                    </InputLabel>
                    <Select
                        labelId="otp-channel-label"
                        label="OTP Channel"
                        value={otpChannel}
                        onChange={(event) => {
                            setOtpChannel(
                                event.target.value
                            );
                            setError("");
                        }}
                    >
                        <MenuItem value="EMAIL">
                            EMAIL
                        </MenuItem>
                        <MenuItem value="SMS">
                            SMS
                        </MenuItem>
                    </Select>
                </FormControl>

                {!otpSent &&
                    otpChannel === "SMS" && (
                        <Alert severity="info">
                            SMS OTP is coming soon.
                            Please use EMAIL for now.
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

                {customerInfo &&
                    !customerInfo.customerExists && (
                        <Alert severity="info">
                            We could not find an
                            existing customer profile
                            for this email. You can
                            still continue with OTP
                            login.
                        </Alert>
                    )}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={
                        loading ||
                        (!otpSent &&
                            otpChannel === "SMS")
                    }
                >
                    {loading ? (
                        <CircularProgress
                            size={24}
                            color="inherit"
                        />
                    ) : otpSent ? (
                        "Verify OTP"
                    ) : otpChannel === "SMS" ? (
                        "SMS Not Supported Yet"
                    ) : (
                        "Get OTP"
                    )}
                </Button>

            </Stack>
        </Box>
    );
};

export default CustomerLoginForm;
