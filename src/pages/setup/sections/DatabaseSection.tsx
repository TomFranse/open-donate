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
        title="Set Up Database"
        description="Create the todos table in your Supabase database. Required for the todos feature with Supabase."
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
      title="Set Up Database Schema"
      saveButtonText="Mark as Complete"
    >
      <Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          This boilerplate includes a todos feature that requires a database table. If you only want
          to test authentication, you can skip this step. Run this SQL in your Supabase SQL Editor
          when you're ready to use the todos feature:
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
              <Typography variant="subtitle2">SQL Migration</Typography>
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
          <Typography variant="body2">
            <strong>How to run this SQL:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="1. Go to your Supabase project dashboard"
                secondary="Navigate to SQL Editor in the left sidebar"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Create a new query"
                secondary="Click 'New query' and paste the SQL above"
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Run the query" secondary="Click 'Run' to execute the SQL" />
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
