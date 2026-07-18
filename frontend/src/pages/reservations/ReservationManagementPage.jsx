import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ROUTES from "../../constants/routes";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import PageSection from "../../components/common/PageSection";

import reservationService from "../../services/reservationService";

import ReservationToolbar from "../../components/reservation/ReservationToolbar";
import ReservationTable from "../../components/reservation/ReservationTable";

import CommonDialog from "../../components/common/CommonDialog";
import CommonSnackbar from "../../components/common/CommonSnackbar";

import ReservationEditDialog from "../../components/reservation/ReservationEditDialog";
import useAuth from "../../hooks/useAuth";

const ReservationManagementPage = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  /**
   * Cancel Dialog State
   */
  const [cancelDialogOpen, setCancelDialogOpen] =
    useState(false);

  /**
   * Edit Dialog State
   */
  const [editDialogOpen, setEditDialogOpen] =
    useState(false);

  const [editLoading, setEditLoading] =
    useState(false);

  const [
    selectedReservation,
    setSelectedReservation,
  ] = useState(null);

  const [cancelLoading, setCancelLoading] =
    useState(false);

  /**
   * Snackbar State
   */
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

const navigate = useNavigate();
const { role, email } = useAuth();

  useEffect(() => {
      if (role) {
          loadReservations();
      }
  }, [role, email]);

  useEffect(() => {
    let result = [...reservations];

    if (statusFilter) {
      result = result.filter(
        (reservation) =>
          reservation.status === statusFilter
      );
    }

    setFilteredReservations(result);
    setPage(0);
  }, [reservations, statusFilter]);

  const sortReservations = (data) =>
    [...data].sort(
      (a, b) =>
        new Date(b.startDate) -
        new Date(a.startDate)
    );

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

      setReservations(sortReservations(data));
    } catch (err) {
      console.error(err);

      setError("Unable to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
      try {
          setLoading(true);
          setError("");

          let data;

          if (role === "ADMIN") {
              const searchEmail = searchText.trim();

              data =
                  searchEmail === ""
                      ? await reservationService.getReservations()
                      : await reservationService.getReservationsByCustomerEmail(
                            searchEmail
                        );
          } else {
              // Customer can only view their own reservations.
              data =
                  await reservationService.getReservationsByCustomerEmail(
                      email
                  );
          }

          setReservations(sortReservations(data));
      } catch (err) {
          console.error(err);

          setReservations([]);

          setError("Unable to load reservations.");
      } finally {
          setLoading(false);
      }
  };

  /**
   * Placeholder
   */
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (editLoading) {
      return;
  }

  setEditDialogOpen(false);
  setSelectedReservation(null);
};

const handleSaveReservation = async (
  request
) => {
  if (!selectedReservation) {
    return;
  }

  try {
    setEditLoading(true);

    await reservationService.updateReservation(
      selectedReservation.reservationId,
      request
    );

    await loadReservations();

    handleCloseEditDialog();

    setSnackbar({
      open: true,
      severity: "success",
      message:
        "Reservation updated successfully.",
    });
  } catch (err) {
    console.error(err);

    setSnackbar({
      open: true,
      severity: "error",
      message:
        "Unable to update reservation.",
    });
  } finally {
    setEditLoading(false);
  }
};
  /**
   * Open Cancel Dialog
   */
  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  /**
   * Close Dialog
   */
  const handleCloseCancelDialog = () => {
    if (cancelLoading) {
      return;
    }

    setCancelDialogOpen(false);
    setSelectedReservation(null);
    setCancelLoading(false);
  };

  /**
   * Confirm Cancellation
   */
  const handleConfirmCancel = async () => {
    if (!selectedReservation) {
      return;
    }

    const reservationId =
      selectedReservation.reservationId;

    try {
      setCancelLoading(true);

      await reservationService.cancelReservation(
        reservationId
      );

      await loadReservations();

      setCancelDialogOpen(false);
      setSelectedReservation(null);

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Reservation cancelled successfully.",
      });
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Unable to cancel reservation.",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const handlePageChange = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  return (
    <>
      <PageContainer>

          <PageHeader
              title="Reservation Management"
              subtitle={
                  role === "ADMIN"
                      ? "Search, update and manage reservations."
                      : "View and manage your reservations."
              }
              actions={
                  <Button
                      variant="contained"
                      onClick={() =>
                          navigate(ROUTES.CREATE_RESERVATION)
                      }
                  >
                      New Reservation
                  </Button>
              }
          />

          <PageSection>

              {role === "ADMIN" && (
                  <ReservationToolbar
                      searchText={searchText}
                      statusFilter={statusFilter}
                      onSearchChange={setSearchText}
                      onStatusChange={setStatusFilter}
                      onSearch={handleSearch}
                  />
              )}

              {loading && (
                  <Box
                      sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 5,
                      }}
                  >
                      <CircularProgress />
                  </Box>
              )}

              {error && (
                  <Alert severity="error">
                      {error}
                  </Alert>
              )}

              {!loading && !error && (
                  <ReservationTable
                      reservations={filteredReservations}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handlePageChange}
                      onEdit={handleEdit}
                      onCancel={handleCancel}
                  />
              )}

          </PageSection>

      </PageContainer>

      <ReservationEditDialog
        open={editDialogOpen}
        reservation={selectedReservation}
        loading={editLoading}
        onClose={handleCloseEditDialog}
        onSave={handleSaveReservation}
      />

      <CommonDialog
        open={cancelDialogOpen}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation?"
        details={
          selectedReservation
            ? [
                {
                  label: "Reservation ID",
                  value:
                    selectedReservation.reservationId,
                },
                {
                  label: "Customer",
                  value:
                    selectedReservation.customerName,
                },
                {
                  label: "Customer Email",
                  value:
                    selectedReservation.customerEmail,
                },
                {
                  label: "Vehicle",
                  value:
                    selectedReservation.vehicleNumber,
                },
                {
                  label: "Category",
                  value:
                    selectedReservation.category.replaceAll(
                      "_",
                      " "
                    ),
                },
              ]
            : []
        }
        confirmText="Cancel Reservation"
        cancelText="No"
        confirmColor="error"
        loading={cancelLoading}
        onCancel={
          handleCloseCancelDialog
        }
        onConfirm={
          handleConfirmCancel
        }
      />

      <CommonSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={
          handleCloseSnackbar
        }
      />
    </>
  );
};

export default ReservationManagementPage;