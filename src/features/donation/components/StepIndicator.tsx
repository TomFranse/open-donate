import { Box } from "@mui/material";

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "flex-end",
        mb: 3,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: currentStep === 1 ? "primary.main" : "background.paper",
          color: currentStep === 1 ? "primary.contrastText" : "text.primary",
          border: currentStep === 1 ? "none" : "1px solid",
          borderColor: "divider",
          fontWeight: 600,
        }}
      >
        1
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: currentStep === 2 ? "primary.main" : "background.paper",
          color: currentStep === 2 ? "primary.contrastText" : "text.primary",
          border: currentStep === 2 ? "none" : "1px solid",
          borderColor: "divider",
          fontWeight: 600,
        }}
      >
        2
      </Box>
    </Box>
  );
};
