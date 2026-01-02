import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { migrateOldSetupState, getSetupSectionsState, getEnabledFeatures } from "@utils/setupUtils";
import { SupabaseCard } from "./setup/sections/SupabaseSection";
import { AirtableCard } from "./setup/sections/AirtableSection";
import { DatabaseCard } from "./setup/sections/DatabaseSection";
import { HostingCard } from "./setup/sections/HostingSection";
import { ThemeCard } from "./setup/sections/ThemeSection";

export const SetupPage = () => {
  const [sectionsState, setSectionsState] = useState(getSetupSectionsState());
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Migrate old state on mount
  useEffect(() => {
    migrateOldSetupState();
    setSectionsState(getSetupSectionsState());
  }, []);

  const handleStatusChange = () => {
    setSectionsState(getSetupSectionsState());
  };

  const calculateProgress = () => {
    const state = getSetupSectionsState();
    const total = Object.keys(state).length;
    const completed = Object.values(state).filter((status) => status === "completed").length;
    return (completed / total) * 100;
  };

  const handleFinishSetup = async () => {
    setFinishing(true);
    try {
      // Mark setup as complete
      localStorage.setItem("setup_complete", "true");

      // Call cleanup script endpoint
      const response = await fetch("/api/finish-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabledFeatures: getEnabledFeatures(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to finish setup");
      }

      // Reload page to apply changes
      window.location.reload();
    } catch {
      alert("Failed to finish setup. Please try again.");
      setFinishing(false);
    }
  };

  const progress = calculateProgress();
  const completedCount = Object.values(sectionsState).filter(
    (status) => status === "completed"
  ).length;
  const totalCount = Object.keys(sectionsState).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Vite MUI Supabase Starter
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Configure your app components. All sections are optional - configure what you need and
          skip the rest.
        </Typography>
      </Box>

      {/* Progress Indicator */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Setup Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completedCount} of {totalCount} completed
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 1 }}
        />
      </Box>

      {/* Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fit, minmax(280px, 1fr))",
            md: "repeat(auto-fit, minmax(320px, 1fr))",
            lg: "repeat(auto-fit, minmax(350px, 1fr))",
          },
          gap: 3,
          mb: 4,
          justifyContent: "center",
        }}
      >
        <SupabaseCard onStatusChange={handleStatusChange} />
        <AirtableCard onStatusChange={handleStatusChange} />
        <DatabaseCard onStatusChange={handleStatusChange} />
        <HostingCard onStatusChange={handleStatusChange} />
        <ThemeCard onStatusChange={handleStatusChange} />
      </Box>

      {/* Finish Setup Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setFinishDialogOpen(true)}
          startIcon={<CheckCircle />}
        >
          Finish Setup
        </Button>
      </Box>

      {/* Finish Setup Confirmation Dialog */}
      <Dialog open={finishDialogOpen} onClose={() => !finishing && setFinishDialogOpen(false)}>
        <DialogTitle>Finish Setup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to finish setup? This action is <strong>irreversible</strong> and
            will:
          </DialogContentText>
          <Box component="ul" sx={{ mt: 2, pl: 3 }}>
            <li>
              <DialogContentText component="span">
                Delete all setup code (SetupPage, setupUtils, cleanup scripts)
              </DialogContentText>
            </li>
            <li>
              <DialogContentText component="span">
                Delete all code for features that were <strong>not enabled</strong>
              </DialogContentText>
            </li>
            <li>
              <DialogContentText component="span">
                Update App.tsx and other files to remove unused imports and routes
              </DialogContentText>
            </li>
          </Box>
          <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            <DialogContentText>
              <strong>Enabled features:</strong> {getEnabledFeatures().join(", ") || "None"}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinishDialogOpen(false)} disabled={finishing}>
            Cancel
          </Button>
          <Button
            onClick={handleFinishSetup}
            variant="contained"
            color="error"
            disabled={finishing}
          >
            {finishing ? "Finishing..." : "Finish Setup"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
