import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import {
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import ROUTES from "../../constants/routes";

const ReservationToolbar = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onSearch,
}) => {
  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
      >
        <TextField
          label="Customer Email"
          placeholder="Enter customer email"
          value={searchText}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          onKeyDown={handleKeyDown}
          sx={{
            flex: 1,
          }}
        />

        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={onSearch}
        >
          Search
        </Button>

        <FormControl
          sx={{
            minWidth: 180,
          }}
        >
          <InputLabel>Status</InputLabel>

          <Select
            value={statusFilter}
            label="Status"
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
          >
            <MenuItem value="">
              All
            </MenuItem>

            <MenuItem value="ACTIVE">
              Active
            </MenuItem>

            <MenuItem value="CANCELLED">
              Cancelled
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate(ROUTES.CREATE_RESERVATION)
          }
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          Create Reservation
        </Button>
      </Stack>
    </Box>
  );
};

export default ReservationToolbar;