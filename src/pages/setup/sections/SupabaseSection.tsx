import { useState } from "react";
import { Box, TextField, Alert, Typography, Card, CardContent, Button } from "@mui/material";
import { CheckCircle, Error as ErrorIcon, ContentCopy } from "@mui/icons-material";
import { SetupCard } from "../components/SetupCard";
import { SetupDialog } from "../components/SetupDialog";
import { isSupabaseConfigured } from "@shared/services/supabaseService";
import { testSupabaseConnection } from "@shared/services/supabaseService";
import { updateSetupSectionStatus, getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";

interface SupabaseSectionProps {
  onStatusChange?: () => void;
}

export const SupabaseCard = ({ onStatusChange }: SupabaseSectionProps) => {
  const state = getSetupSectionsState();
  const status: SetupStatus = isSupabaseConfigured() ? "completed" : state.supabase;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <SetupCard
        title="Configure Supabase"
        description="Set up Supabase for authentication and database features. Recommended for production apps."
        status={status}
        onClick={() => setDialogOpen(true)}
      />
      <SupabaseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

interface SupabaseDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const SupabaseDialog = ({ open, onClose, onStatusChange }: SupabaseDialogProps) => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [envWritten, setEnvWritten] = useState(false);
  const [writingEnv, setWritingEnv] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleWriteEnv = async () => {
    if (!supabaseUrl || !supabaseKey) {
      return;
    }

    setWritingEnv(true);
    try {
      const response = await fetch("/api/write-env", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          VITE_SUPABASE_URL: supabaseUrl,
          VITE_SUPABASE_PUBLISHABLE_KEY: supabaseKey,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEnvWritten(true);
      } else {
        setTestResult({
          success: false,
          error: data.message || "Failed to write environment variables",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to write environment variables",
      });
    } finally {
      setWritingEnv(false);
    }
  };

  const handleCopyEnv = () => {
    const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_PUBLISHABLE_KEY=${supabaseKey}
# Legacy: VITE_SUPABASE_ANON_KEY also works for backward compatibility`;
    void navigator.clipboard.writeText(envContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    // If not tested or env not written, test first
    if (!testResult?.success || !envWritten) {
      if (!supabaseUrl || !supabaseKey) {
        setTestResult({ success: false, error: "Please enter both URL and API key" });
        return;
      }

      setTesting(true);
      setTestResult(null);
      setEnvWritten(false);

      const result = await testSupabaseConnection(supabaseUrl, supabaseKey);
      setTestResult(result);
      setTesting(false);

      if (result.success) {
        await handleWriteEnv();
        // After writing env, mark as completed
        updateSetupSectionStatus("supabase", "completed");
        onStatusChange?.();
      }
    } else {
      // Already tested and written, just mark as completed
      updateSetupSectionStatus("supabase", "completed");
      onStatusChange?.();
    }
  };

  const handleSkip = () => {
    updateSetupSectionStatus("supabase", "skipped");
    onStatusChange?.();
    onClose();
  };

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Supabase Credentials"
      saveButtonText={testResult?.success && envWritten ? "Save" : "Test & Save"}
      saveButtonDisabled={!supabaseUrl || !supabaseKey || testing || writingEnv}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          You can configure Supabase to enable authentication and database features. If you don't
          have a Supabase project yet,{" "}
          <Typography
            component="a"
            href="https://supabase.com"
            target="_blank"
            rel="noopener"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            create a free account
          </Typography>
          . You can also skip this step and configure it later.
        </Typography>

        <Box sx={{ my: 3 }}>
          <TextField
            label="Supabase Project URL"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="https://your-project.supabase.co"
            helperText="Find this in your Supabase project settings under API"
          />
          <TextField
            label="Supabase Publishable Key"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
            placeholder="your-publishable-key"
            helperText="Find this in your Supabase project settings under API (previously called 'anon key')"
          />
        </Box>

        {testResult && (
          <Alert
            severity={testResult.success ? "success" : "error"}
            icon={testResult.success ? <CheckCircle /> : <ErrorIcon />}
            sx={{ mb: 2 }}
          >
            {testResult.success
              ? envWritten
                ? "Connection successful and environment variables saved!"
                : writingEnv
                  ? "Writing environment variables..."
                  : "Connection successful! Writing environment variables..."
              : `Connection failed: ${testResult.error}`}
          </Alert>
        )}

        {envWritten && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Environment variables have been written to your{" "}
              <Typography component="code" sx={{ bgcolor: "grey.200", px: 0.5, borderRadius: 0.5 }}>
                .env
              </Typography>{" "}
              file. Please <strong>restart your development server</strong> for the changes to take
              effect.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Stop the server (Ctrl+C) and run <code>pnpm dev</code> again.
            </Typography>
          </Alert>
        )}

        {testResult?.success && envWritten && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Environment Variables
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              These values have been written to your{" "}
              <Typography component="code" sx={{ bgcolor: "grey.200", px: 0.5, borderRadius: 0.5 }}>
                .env
              </Typography>{" "}
              file:
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
                      VITE_SUPABASE_URL={supabaseUrl}
                    </Typography>
                    <Typography
                      component="code"
                      sx={{ display: "block", bgcolor: "grey.200", px: 0.5, borderRadius: 0.5 }}
                    >
                      VITE_SUPABASE_PUBLISHABLE_KEY={supabaseKey}
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
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleSkip} color="inherit">
            Skip Supabase Setup
          </Button>
        </Box>
      </Box>
    </SetupDialog>
  );
};
