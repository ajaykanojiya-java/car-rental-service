import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import reservationService from "../../services/reservationService";
import ROUTES from "../../constants/routes";
import ReservationStatusChip from "./ReservationStatusChip";
import useAuth from "../../hooks/useAuth";

const RecentReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { role, email } = useAuth();

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
          role === "ADMIN"
              ? await reservationService.getReservations()
              : await reservationService.getReservationsByCustomerEmail(
                    email
                );

      const latestReservations = [...data]
        .sort(
          (a, b) =>
            new Date(b.startDate) -
            new Date(a.startDate)
        )
        .slice(0, 5);

      setReservations(latestReservations);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load recent reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();

    if (location.state?.refresh) {
      navigate(ROUTES.DASHBOARD, {
        replace: true,
        state: null,
      });
    }
  }, [
      location.state?.refresh,
      role,
      email,
  ]);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(amount));

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        mt: 5,
      }}
    >
      <Typography
          variant="h6"
          sx={{
              p: 2,
              fontWeight: "bold",
          }}
      >
          {role === "ADMIN"
              ? "Recent Reservations"
              : "My Recent Reservations"}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Customer</strong>
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
          </TableRow>
        </TableHead>

        <TableBody>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.reservationId}
              hover
            >
              <TableCell>
                {reservation.customerName}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentReservations;