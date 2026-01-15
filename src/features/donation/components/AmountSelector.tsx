import { Box, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import type { DonationAmount } from "../types/donation.types";

interface AmountSelectorProps {
  value: DonationAmount;
  customAmount?: number;
  onChange: (amount: DonationAmount) => void;
  onCustomAmountChange: (amount: number) => void;
}

const PRESET_AMOUNTS: DonationAmount[] = [6, 10, 15];

export const AmountSelector = ({
  value,
  customAmount,
  onChange,
  onCustomAmountChange,
}: AmountSelectorProps) => {
  const [customInput, setCustomInput] = useState<string>(
    value === "custom" && customAmount ? customAmount.toString() : ""
  );

  useEffect(() => {
    if (value === "custom" && customAmount) {
      setCustomInput(customAmount.toString());
    } else if (value !== "custom") {
      setCustomInput("");
    }
  }, [value, customAmount]);

  const handleCustomInputChange = (input: string) => {
    setCustomInput(input);
    const numValue = parseFloat(input);
    if (!isNaN(numValue) && numValue > 0) {
      onCustomAmountChange(numValue);
    } else if (input === "" || input === "0") {
      onCustomAmountChange(0);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: value === "custom" ? 2 : 0,
        }}
      >
        {PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant={value === amount ? "contained" : "outlined"}
            onClick={() => onChange(amount)}
            sx={{
              minWidth: 80,
              borderColor: value === amount ? "transparent" : "divider",
              backgroundColor: value === amount ? "primary.main" : "background.paper",
              color: value === amount ? "primary.contrastText" : "text.primary",
              "&:hover": {
                backgroundColor: value === amount ? "primary.dark" : "action.hover",
              },
            }}
          >
            €{amount}
          </Button>
        ))}
        <Button
          variant={value === "custom" ? "contained" : "outlined"}
          onClick={() => onChange("custom")}
          sx={{
            minWidth: 80,
            borderColor: value === "custom" ? "transparent" : "divider",
            backgroundColor: value === "custom" ? "primary.main" : "background.paper",
            color: value === "custom" ? "primary.contrastText" : "text.primary",
            "&:hover": {
              backgroundColor: value === "custom" ? "primary.dark" : "action.hover",
            },
          }}
        >
          Anders
        </Button>
      </Box>
      {value === "custom" && (
        <Box sx={{ mt: 2 }}>
          <TextField
            type="number"
            label="Ander bedrag"
            value={customInput}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ maxWidth: 200 }}
          />
        </Box>
      )}
    </Box>
  );
};
