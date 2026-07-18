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
import ROUTES from "../../constants/routes";

const AdminLoginForm = () => {
    const navigate = useNavigate();

    const { loginAsAdmin } = useAuth();

    const [hashKey, setHashKey] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();

        setError("");

        if (!hashKey.trim()) {
            setError("Please enter the admin hash key.");
            return;
        }

        const success = loginAsAdmin(hashKey.trim());

        if (!success) {
            setError("Invalid admin hash key.");
            return;
        }

        navigate(ROUTES.DASHBOARD, {
            replace: true,
        });
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
                    label="Admin Hash Key"
                    type="password"
                    fullWidth
                    autoFocus
                    value={hashKey}
                    onChange={(event) =>
                        setHashKey(event.target.value)
                    }
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                >
                    Login
                </Button>
            </Stack>
        </Box>
    );
};

export default AdminLoginForm;