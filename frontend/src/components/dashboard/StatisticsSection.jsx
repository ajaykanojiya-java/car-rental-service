import { Grid } from "@mui/material";

import {
  DirectionsCarFilled,
  CalendarMonth,
  CarRental,
  CurrencyRupee,
} from "@mui/icons-material";

import StatisticsCard from "./StatisticsCard";

const statistics = [
  {
    title: "Total Cars",
    value: "120",
    icon: <DirectionsCarFilled color="primary" />,
  },
  {
    title: "Reservations",
    value: "45",
    icon: <CalendarMonth color="primary" />,
  },
  {
    title: "Active Rentals",
    value: "18",
    icon: <CarRental color="primary" />,
  },
  {
    title: "Revenue",
    value: "₹2,45,000",
    icon: <CurrencyRupee color="primary" />,
  },
];

const StatisticsSection = () => {
  return (
    <Grid container spacing={3}>
      {statistics.map((stat) => (
        <Grid
          key={stat.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatisticsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsSection;