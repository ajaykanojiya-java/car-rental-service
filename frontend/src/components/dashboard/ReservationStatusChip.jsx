import { Chip } from "@mui/material";

const ReservationStatusChip = ({ status }) => {
  const color =
    status === "ACTIVE" ? "success" : "error";

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      variant="filled"
    />
  );
};

export default ReservationStatusChip;