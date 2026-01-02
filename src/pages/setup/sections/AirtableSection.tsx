import { useState } from "react";
import {
  Box,
  TextField,
  Alert,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CheckCircle, Error as ErrorIcon, ContentCopy } from "@mui/icons-material";
import { SetupCard } from "../components/SetupCard";
import { SetupDialog } from "../components/SetupDialog";
import { isAirtableConfigured } from "@shared/services/airtableService";
import { testAirtableConnection } from "@shared/services/airtableService";
import { updateSetupSectionStatus, getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";

interface AirtableSectionProps {
  onStatusChange?: () => void;
}

export const AirtableCard = ({ onStatusChange }: AirtableSectionProps) => {
  const state = getSetupSectionsState();
  const status: SetupStatus = isAirtableConfigured() ? "completed" : state.airtable;
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
  const [airtableApiKey, setAirtableApiKey] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableId, setAirtableTableId] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTestConnection = async () => {
    if (!airtableApiKey || !airtableBaseId || !airtableTableId) {
      setTestResult({
        success: false,
        error: "Please enter API key, Base ID, and Table ID",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testAirtableConnection(airtableApiKey, airtableBaseId, airtableTableId);
    setTestResult(result);
    setTesting(false);
  };

  const handleCopyEnv = () => {
    const envContent = `VITE_AIRTABLE_API_KEY=${airtableApiKey}
VITE_AIRTABLE_BASE_ID=${airtableBaseId}
VITE_AIRTABLE_TABLE_ID=${airtableTableId}`;
    void navigator.clipboard.writeText(envContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!testResult?.success) {
      await handleTestConnection();
    }
    if (testResult?.success) {
      updateSetupSectionStatus("airtable", "completed");
      onStatusChange?.();
    }
  };

  const handleSkip = () => {
    updateSetupSectionStatus("airtable", "skipped");
    onStatusChange?.();
    onClose();
  };

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Airtable"
      saveButtonText={testResult?.success ? "Save" : "Test & Save"}
      saveButtonDisabled={!airtableApiKey || !airtableBaseId || !airtableTableId || testing}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          You can configure Airtable as an alternative data backend. Airtable is data-only;
          authentication still requires Supabase. If you don't have an Airtable account yet,{" "}
          <Typography
            component="a"
            href="https://airtable.com"
            target="_blank"
            rel="noopener"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            create a free account
          </Typography>
          . You can also skip this step and use Supabase or browser storage.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> To use Airtable, you'll need:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Personal Access Token (from Airtable account settings)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Base ID (found in your base's API documentation)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Table ID (the name of your table, e.g., 'Todos')" />
            </ListItem>
          </List>
        </Alert>

        <Box sx={{ my: 3 }}>
          <TextField
            label="Airtable API Key"
            value={airtableApiKey}
            onChange={(e) => setAirtableApiKey(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
            placeholder="pat..."
            helperText="Personal Access Token from Airtable account settings"
          />
          <TextField
            label="Airtable Base ID"
            value={airtableBaseId}
            onChange={(e) => setAirtableBaseId(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="app..."
            helperText="Found in your base's API documentation"
          />
          <TextField
            label="Airtable Table ID"
            value={airtableTableId}
            onChange={(e) => setAirtableTableId(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Todos"
            helperText="The name of your table (e.g., 'Todos')"
          />
        </Box>

        {testResult && (
          <Alert
            severity={testResult.success ? "success" : "error"}
            icon={testResult.success ? <CheckCircle /> : <ErrorIcon />}
            sx={{ mb: 2 }}
          >
            {testResult.success
              ? "Connection successful! Add the environment variables below to your .env file."
              : `Connection failed: ${testResult.error}`}
          </Alert>
        )}

        {testResult?.success && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add to .env file
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Copy these values to your{" "}
              <Typography component="code" sx={{ bgcolor: "grey.200", px: 0.5, borderRadius: 0.5 }}>
                .env
              </Typography>{" "}
              file in the project root:
            </Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      component="code"
                      sx={{
                        display: "block",
                        mb: 1,
                        bgcolor: "grey.200",
                        px: 0.5,
                        borderRadius: 0.5,
                      }}
                    >
                      VITE_AIRTABLE_API_KEY={airtableApiKey}
                    </Typography>
                    <Typography
                      component="code"
                      sx={{
                        display: "block",
                        mb: 1,
                        bgcolor: "grey.200",
                        px: 0.5,
                        borderRadius: 0.5,
                      }}
                    >
                      VITE_AIRTABLE_BASE_ID={airtableBaseId}
                    </Typography>
                    <Typography
                      component="code"
                      sx={{ display: "block", bgcolor: "grey.200", px: 0.5, borderRadius: 0.5 }}
                    >
                      VITE_AIRTABLE_TABLE_ID={airtableTableId}
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<ContentCopy />}
                    onClick={handleCopyEnv}
                    variant="outlined"
                    size="small"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Alert severity="info" sx={{ mb: 2 }}>
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

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleSkip} color="inherit">
            Skip Airtable Setup
          </Button>
        </Box>
      </Box>
    </SetupDialog>
  );
};
