import { useState } from "react";
import {
  Box,
  Alert,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { SetupCard } from "../components/SetupCard";
import { SetupDialog } from "../components/SetupDialog";
import { updateSetupSectionStatus, getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";

interface DatabaseSectionProps {
  onStatusChange?: () => void;
}

export const DatabaseCard = ({ onStatusChange }: DatabaseSectionProps) => {
  const state = getSetupSectionsState();
  const status: SetupStatus =
    localStorage.getItem("database_setup_complete") === "true" ? "completed" : state.database;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <SetupCard
        title="Create Database Tables"
        description="Run SQL migrations to create the todos table in your Supabase database. Only needed if you want cloud-synced todos. Requires Supabase to be configured first."
        status={status}
        onClick={() => setDialogOpen(true)}
      />
      <DatabaseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

interface DatabaseDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const SQL_MIGRATION = `CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own todos
CREATE POLICY "Users can manage their own todos"
  ON todos
  FOR ALL
  USING (auth.uid() = user_id);`;

const DatabaseDialog = ({ open, onClose, onStatusChange }: DatabaseDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopySQL = () => {
    void navigator.clipboard.writeText(SQL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    localStorage.setItem("database_setup_complete", "true");
    updateSetupSectionStatus("database", "completed");
    onStatusChange?.();
  };

  const handleSkip = () => {
    updateSetupSectionStatus("database", "skipped");
    onStatusChange?.();
    onClose();
  };

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Create Database Tables"
      saveButtonText="Mark as Complete"
    >
      <Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          To enable cloud-synced todos that work across devices, you need to create the database
          table in your Supabase project. Copy the SQL below and run it in your Supabase SQL Editor.
          If you only need authentication or prefer browser storage for todos, you can skip this
          step.
        </Typography>

        <Card variant="outlined" sx={{ my: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">SQL Migration Script</Typography>
              <Button
                startIcon={<ContentCopy />}
                onClick={handleCopySQL}
                variant="outlined"
                size="small"
              >
                {copied ? "Copied!" : "Copy SQL"}
              </Button>
            </Box>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
                m: 0,
              }}
            >
              {SQL_MIGRATION}
            </Box>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>How to run this SQL migration:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="1. Open your Supabase project dashboard"
                secondary="Make sure you've completed the 'Connect to Supabase' step first"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Navigate to SQL Editor"
                secondary="Click 'SQL Editor' in the left sidebar, then 'New query'"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Paste and run the SQL"
                secondary="Paste the SQL above and click 'Run' to create the todos table"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Mark as complete"
                secondary="After running the SQL successfully, click 'Mark as Complete' below"
              />
            </ListItem>
          </List>
        </Alert>

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleSkip} color="inherit">
            Skip Database Setup
          </Button>
        </Box>
      </Box>
    </SetupDialog>
  );
};
