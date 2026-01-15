import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
} from "@mui/material";
import { Input } from "@/components/common/Input";
import type { PersonalDetails } from "../types/donation.types";

interface PersonalDetailsProps {
  personalDetails: PersonalDetails;
  onChange: (details: Partial<PersonalDetails>) => void;
}

export const PersonalDetailsSection = ({ personalDetails, onChange }: PersonalDetailsProps) => {
  const handleFieldChange = (field: keyof PersonalDetails, value: string | boolean) => {
    onChange({ [field]: value });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Persoonlijke gegevens
      </Typography>

      {/* Gender selection */}
      <FormControl component="fieldset" sx={{ mb: 3, mt: 2 }}>
        <RadioGroup
          row
          value={personalDetails.gender || ""}
          onChange={(e) => handleFieldChange("gender", e.target.value)}
          sx={{ gap: 3 }}
        >
          <FormControlLabel value="man" control={<Radio />} label="Man" />
          <FormControlLabel value="vrouw" control={<Radio />} label="Vrouw" />
          <FormControlLabel value="ander" control={<Radio />} label="Ander" />
        </RadioGroup>
      </FormControl>

      {/* Name fields */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Input
          label="Voornaam"
          value={personalDetails.voornaam || ""}
          onChange={(e) => handleFieldChange("voornaam", e.target.value)}
          fullWidth
        />
        <Input
          label="Tussenvoegsel"
          value={personalDetails.tussenvoegsel || ""}
          onChange={(e) => handleFieldChange("tussenvoegsel", e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Input
          label="Achternaam"
          value={personalDetails.achternaam || ""}
          onChange={(e) => handleFieldChange("achternaam", e.target.value)}
          fullWidth
        />
      </Box>

      {/* Contact fields */}
      <Box sx={{ mb: 2 }}>
        <Input
          label="E-mailadres"
          type="email"
          value={personalDetails.email || ""}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          fullWidth
          autoComplete="email"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Input
          label="Telefoonnummer"
          type="tel"
          value={personalDetails.telefoonnummer || ""}
          onChange={(e) => handleFieldChange("telefoonnummer", e.target.value)}
          fullWidth
          autoComplete="tel"
        />
      </Box>

      {/* Email updates checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={personalDetails.emailUpdates || false}
            onChange={(e) => handleFieldChange("emailUpdates", e.target.checked)}
          />
        }
        label="Ja, vertel mij per e-mail over de impact van mijn steun en andere noodhulpacties"
      />
    </Box>
  );
};
