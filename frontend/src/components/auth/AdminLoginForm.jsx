import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Stack,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import ROUTES from "../../constants/routes";

const AdminLoginForm = () => {
    const navigate = useNavigate();

    const { loginAsAdmin } = useAuth();

    const [email, setEmail] = useState("admin@carrental.com");
    const [hashKey, setHashKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter the admin email.");
            return;
        }

        if (!hashKey.trim()) {
            setError("Please enter the admin hash key.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.adminLogin(email.trim(), hashKey.trim());
            loginAsAdmin(response);
            navigate(ROUTES.DASHBOARD, {
                replace: true,
            });
        } catch (err) {
            setError(err.response?.data?.message || "Invalid admin credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
        >
            <Stack spacing={3}>
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Admin Email"
                    type="email"
                    fullWidth
                    autoFocus
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    disabled={loading}
                />

                <TextField
                    label="Admin Hash Key"
                    type="password"
                    fullWidth
                    value={hashKey}
                    onChange={(event) =>
                        setHashKey(event.target.value)
                    }
                    disabled={loading}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </Stack>
        </Box>
    );
};

export default AdminLoginForm;
