import { useState, useEffect } from "react";
import { Box, Alert, Typography, Button, Stepper, Step, StepLabel } from "@mui/material";
import { SetupCard } from "../SetupCard";
import { SetupDialog } from "../SetupDialog";
import { EnvVariablesDisplay } from "../EnvVariablesDisplay";
import { AirtableFormFields } from "../AirtableFormFields";
import { AirtableDescription } from "../AirtableDescription";
import { AirtablePatInstructions } from "../AirtablePatInstructions";
import { TableStructureDisplay } from "../TableStructureDisplay";
import { useAirtableSetup } from "../../hooks/useAirtableSetup";
import { updateSetupSectionStatus, getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";

interface AirtableSectionProps {
  onStatusChange?: () => void;
}

export const AirtableCard = ({ onStatusChange }: AirtableSectionProps) => {
  const { isConfigured } = useAirtableSetup();
  const state = getSetupSectionsState();
  const status: SetupStatus = isConfigured ? "completed" : state.airtable;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <SetupCard
        title="Configure Airtable"
        description="Set up Airtable as an alternative data backend. Data-only; authentication still requires Supabase."
        status={status}
        onClick={() => setDialogOpen(true)}
      />
      <AirtableDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

interface AirtableDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const AirtableDialog = ({ open, onClose, onStatusChange }: AirtableDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [airtableApiKey, setAirtableApiKey] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableId, setAirtableTableId] = useState("");
  const { fetchTableStructure, tableStructure, loadingStructure, structureError, resetStructure } =
    useAirtableSetup();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setAirtableApiKey("");
      setAirtableBaseId("");
      setAirtableTableId("");
      resetStructure();
    }
  }, [open, resetStructure]);

  const handleNext = async () => {
    if (activeStep === 0) {
      // Step 0: PAT instructions - just move to credentials step
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Step 1: Validate credentials are filled
      if (!airtableApiKey || !airtableBaseId || !airtableTableId) {
        return;
      }
      // Move to validation step and fetch structure
      setActiveStep(2);
      await fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId);
    } else if (activeStep === 2) {
      // Step 2: Move to completion step
      setActiveStep(3);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 3) {
        // Reset structure when going back from completion step
        resetStructure();
      }
    }
  };

  const handleSave = async () => {
    if (activeStep < 3) {
      await handleNext();
      return;
    }

    // Final step - mark as completed
    updateSetupSectionStatus("airtable", "completed");
    onStatusChange?.();
    onClose();
  };

  const handleSkip = () => {
    updateSetupSectionStatus("airtable", "skipped");
    onStatusChange?.();
    onClose();
  };

  const canProceedFromStep1 = airtableApiKey && airtableBaseId && airtableTableId;
  const canProceedFromStep2 = tableStructure !== null && !loadingStructure && !structureError;

  const getSaveButtonText = () => {
    if (activeStep === 0) return "Continue";
    if (activeStep === 1) return "Next";
    if (activeStep === 2) return canProceedFromStep2 ? "Next" : "Validating...";
    return "Finish Setup";
  };

  const getSaveButtonDisabled = () => {
    if (activeStep === 0) return false; // Always enabled for PAT instructions
    if (activeStep === 1) return !canProceedFromStep1;
    if (activeStep === 2) return loadingStructure || !canProceedFromStep2;
    return false;
  };

  const steps = ["Create PAT", "Enter Credentials", "Validate Connection", "Complete Setup"];

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Airtable"
      saveButtonText={getSaveButtonText()}
      saveButtonDisabled={getSaveButtonDisabled()}
      showCancel={activeStep === 0 || activeStep === 1}
      closeOnSave={activeStep === 3}
    >
      <Box>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Create PAT Instructions */}
        {activeStep === 0 && (
          <Box>
            <AirtablePatInstructions onContinue={handleNext} />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleSkip} color="inherit">
                Skip Airtable Setup
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 1: Enter Credentials */}
        {activeStep === 1 && (
          <Box>
            <AirtableDescription />

            <AirtableFormFields
              apiKey={airtableApiKey}
              baseId={airtableBaseId}
              tableId={airtableTableId}
              onApiKeyChange={setAirtableApiKey}
              onBaseIdChange={setAirtableBaseId}
              onTableIdChange={setAirtableTableId}
            />

            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleSkip} color="inherit">
                Skip Airtable Setup
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Validate Connection */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Validating Connection
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fetching table structure from Airtable...
            </Typography>

            <TableStructureDisplay
              structure={tableStructure}
              loading={loadingStructure}
              error={structureError}
            />

            {structureError && (
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId)
                  }
                  disabled={loadingStructure}
                >
                  Retry
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Step 3: Complete Setup */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Setup Complete
            </Typography>

            <TableStructureDisplay structure={tableStructure} />

            <EnvVariablesDisplay
              variables={[
                { name: "VITE_AIRTABLE_API_KEY", value: airtableApiKey },
                { name: "VITE_AIRTABLE_BASE_ID", value: airtableBaseId },
                { name: "VITE_AIRTABLE_TABLE_ID", value: airtableTableId },
              ]}
              title="Add to .env file"
              description="Copy these values to your .env file in the project root:"
            />

            <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
              <Typography variant="body2">
                <strong>Important:</strong> After adding these to your{" "}
                <Typography
                  component="code"
                  sx={{ bgcolor: "grey.200", px: 0.5, borderRadius: 0.5 }}
                >
                  .env
                </Typography>{" "}
                file, restart your development server for the changes to take effect.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Navigation buttons */}
        {activeStep > 0 && activeStep < 3 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack}>Back</Button>
            <Box />
          </Box>
        )}
      </Box>
    </SetupDialog>
  );
};
