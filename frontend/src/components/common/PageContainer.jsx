import { Container } from "@mui/material";

const PageContainer = ({ children, maxWidth = "xl" }) => {
    return (
        <Container
            maxWidth={maxWidth}
            sx={{
                py: 4,
            }}
        >
            {children}
        </Container>
    );
};

export default PageContainer;