import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const PricingResults = ({ pricing }) => {
  if (!pricing.length) {
    return null;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={3}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: "bold",
        }}
      >
        Pricing Options
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Vehicle Category</strong>
            </TableCell>

            <TableCell align="right">
              <strong>Total Amount</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pricing.map((item) => (
            <TableRow key={item.category}>
              <TableCell>
                {item.category}
              </TableCell>

              <TableCell align="right">
                ₹{item.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PricingResults;