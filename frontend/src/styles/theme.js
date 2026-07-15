import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1565c0",
        },
        secondary: {
            main: "#2e7d32",
        },
        background: {
            default: "#f4f6f8",
        },
    },

    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        }
    }
});

export default theme;