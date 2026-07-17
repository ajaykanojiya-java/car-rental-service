import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

const CommonDialog = ({
  open,
  title,
  message,
  details = [],
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false,
  maxWidth = "sm",
  fullWidth = true,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={!loading ? onCancel : undefined}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {message && (
          <DialogContentText sx={{ mb: 3 }}>
            {message}
          </DialogContentText>
        )}

        {details.length > 0 && (
          <Stack spacing={2}>
            {details.map((detail, index) => {
              const content = detail.render
                ? detail.render(detail)
                : detail.value;

              return (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      minWidth: 150,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {detail.label}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      textAlign: "right",
                      wordBreak: "break-word",
                    }}
                    component="div"
                  >
                    {content}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        )}

        {details.length > 0 && (
          <>
            <Divider sx={{ mt: 3 }} />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 2,
                display: "block",
              }}
            >
              This action cannot be undone.
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : null
          }
        >
          {loading ? "Please wait..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;