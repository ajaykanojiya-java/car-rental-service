import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const StatisticsCard = ({ title, value, icon }) => {
  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        transition: "all 0.3s ease",
        cursor: "pointer",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          {icon}

          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            {title}
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;