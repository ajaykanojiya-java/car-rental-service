import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { DirectionsCar as DirectionsCarIcon } from "@mui/icons-material";

import AdminLoginForm from "./AdminLoginForm";
import CustomerLoginForm from "./CustomerLoginForm";

const LoginPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Card
                    elevation={6}
                    sx={{
                        width: "100%",
                        maxWidth: 500,
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            mb={4}
                        >
                            <DirectionsCarIcon
                                color="primary"
                                sx={{
                                    fontSize: 56,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight="bold"
                                gutterBottom
                            >
                                Car Rental Service
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                Welcome! Please sign in to continue.
                            </Typography>
                        </Box>

                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            centered
                            variant="fullWidth"
                            sx={{ mb: 4 }}
                        >
                            <Tab label="Admin" />
                            <Tab label="Customer" />
                        </Tabs>

                        {selectedTab === 0 && <AdminLoginForm />}

                        {selectedTab === 1 && <CustomerLoginForm />}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default LoginPage;