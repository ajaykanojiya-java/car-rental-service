import { Box } from "@mui/material";

const PageSection = ({ children }) => {
    return (
        <Box
            sx={{
                mt: 4,
            }}
        >
            {children}
        </Box>
    );
};

export default PageSection;