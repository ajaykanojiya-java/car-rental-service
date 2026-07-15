import { Box } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title="Car Rental Service" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;