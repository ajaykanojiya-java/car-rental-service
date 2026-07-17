import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  CancelOutlined as CancelIcon,
  EditOutlined as EditIcon,
} from "@mui/icons-material";

import ReservationStatusChip from "../dashboard/ReservationStatusChip";

const ReservationTable = ({
  reservations,
  page,
  rowsPerPage,
  onPageChange,
  onEdit,
  onCancel,
}) => {
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));

  if (!reservations.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: "center",
        }}
      >
        <Typography>
          No reservations found.
        </Typography>
      </Paper>
    );
  }

  const pagedReservations = reservations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Customer</strong>
              </TableCell>

              <TableCell>
                <strong>Email</strong>
              </TableCell>

              <TableCell>
                <strong>Vehicle</strong>
              </TableCell>

              <TableCell>
                <strong>Category</strong>
              </TableCell>

              <TableCell>
                <strong>Start Date</strong>
              </TableCell>

              <TableCell>
                <strong>End Date</strong>
              </TableCell>

              <TableCell align="right">
                <strong>Amount</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Status</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pagedReservations.map((reservation) => (
              <TableRow
                hover
                key={reservation.reservationId}
              >
                <TableCell>
                  {reservation.customerName}
                </TableCell>

                <TableCell>
                  {reservation.customerEmail}
                </TableCell>

                <TableCell>
                  {reservation.vehicleNumber}
                </TableCell>

                <TableCell>
                  {reservation.category.replaceAll(
                    "_",
                    " "
                  )}
                </TableCell>

                <TableCell>
                  {formatDate(reservation.startDate)}
                </TableCell>

                <TableCell>
                  {formatDate(reservation.endDate)}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    reservation.totalAmount
                  )}
                </TableCell>

                <TableCell align="center">
                  <ReservationStatusChip
                    status={reservation.status}
                  />
                </TableCell>

                <TableCell align="center">
                  <Tooltip
                    title={
                      reservation.status === "ACTIVE"
                        ? "Edit Reservation"
                        : "Cancelled reservations cannot be edited"
                    }
                  >
                    <span>
                      <IconButton
                        color="primary"
                        disabled={reservation.status !== "ACTIVE"}
                        onClick={() => onEdit(reservation)}
                      >
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip
                    title={
                      reservation.status === "ACTIVE"
                        ? "Cancel Reservation"
                        : "Reservation already cancelled"
                    }
                  >
                    <span>
                      <IconButton
                        color="error"
                        disabled={reservation.status !== "ACTIVE"}
                        onClick={() => onCancel(reservation)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={reservations.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
        onPageChange={onPageChange}
      />
    </Paper>
  );
};

export default ReservationTable;