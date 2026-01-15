import { Box, Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";
import type { DonationFrequency } from "../types/donation.types";

interface FrequencySelectorProps {
  value: DonationFrequency;
  onChange: (frequency: DonationFrequency) => void;
}

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <RadioGroup
        row
        value={value}
        onChange={(e) => onChange(e.target.value as DonationFrequency)}
        sx={{ gap: 3 }}
      >
        <FormControlLabel
          value="eenmalig"
          control={<Radio />}
          label={<Typography variant="body1">Eenmalig</Typography>}
        />
        <FormControlLabel
          value="maandelijks"
          control={<Radio />}
          label={<Typography variant="body1">Maandelijks</Typography>}
        />
        <FormControlLabel
          value="jaarlijks"
          control={<Radio />}
          label={<Typography variant="body1">Jaarlijks</Typography>}
        />
      </RadioGroup>
    </Box>
  );
};
