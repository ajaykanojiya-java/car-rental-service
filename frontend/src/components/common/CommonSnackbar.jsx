import { Alert, Snackbar } from "@mui/material";

const CommonSnackbar = ({
  open,
 message,
  severity = "success",
  autoHideDuration = 4000,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  onClose,
}) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      onClose={handleClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={handleClose}
        sx={{
          width: "100%",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CommonSnackbar;