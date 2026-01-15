import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { StepIndicator } from "./StepIndicator";
import { FrequencySelector } from "./FrequencySelector";
import { AmountSelector } from "./AmountSelector";
import { DonationInfoBox } from "./DonationInfoBox";
import { PersonalDetailsSection } from "./PersonalDetails";
import { useDonationForm } from "../hooks/useDonationForm";

export const DonationForm = () => {
  const theme = useTheme();
  const {
    formData,
    setFrequency,
    setAmount,
    setCustomAmount,
    setPersonalDetails,
    getCurrentAmount,
  } = useDonationForm();

  const currentAmount = getCurrentAmount();

  return (
    <Box
      sx={{
        maxWidth: theme.breakpoints.values.md,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <StepIndicator currentStep={formData.step} />

      <FrequencySelector value={formData.frequency} onChange={setFrequency} />

      <AmountSelector
        value={formData.amount}
        customAmount={formData.customAmount}
        onChange={setAmount}
        onCustomAmountChange={setCustomAmount}
      />

      {currentAmount > 0 && <DonationInfoBox amount={currentAmount} />}

      {formData.step === 1 && (
        <PersonalDetailsSection
          personalDetails={formData.personalDetails || {}}
          onChange={setPersonalDetails}
        />
      )}
    </Box>
  );
};
