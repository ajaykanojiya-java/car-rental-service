import {
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

const PageHeader = ({
    title,
    subtitle,
    actions,
}) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    md: "center",
                }}
                spacing={2}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {actions && (
                    <Box>
                        {actions}
                    </Box>
                )}
            </Stack>

            <Divider sx={{ mt: 3 }} />
        </Box>
    );
};

export default PageHeader;