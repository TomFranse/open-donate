import { Box, Typography } from "@mui/material";

interface DonationInfoBoxProps {
  amount: number;
}

export const DonationInfoBox = ({ amount }: DonationInfoBoxProps) => {
  const message = `Met jouw steun van € ${amount.toFixed(2).replace(".", ",")} draag je bij aan o.a. schoon drinkwater, voedsel, medische zorg en veilig onderdak.`;

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        p: 3,
        mb: 4,
      }}
    >
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};
