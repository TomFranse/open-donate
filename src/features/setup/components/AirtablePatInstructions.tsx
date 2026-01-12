import { Box, Typography, Alert, List, ListItem, ListItemText, Button, Link } from "@mui/material";
import { Launch, CheckCircle } from "@mui/icons-material";

interface AirtablePatInstructionsProps {
  onContinue: () => void;
}

export const AirtablePatInstructions = ({ onContinue }: AirtablePatInstructionsProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create Personal Access Token
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Before configuring Airtable, you need to create a Personal Access Token (PAT) with the
        required permissions.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Required Scopes:</strong>
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• schema.bases:read - To read table structure" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• data.records:read - To test connection" />
          </ListItem>
        </List>
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Steps to create your PAT:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary={
                <>
                  Click the button below to open{" "}
                  <Link
                    href="https://airtable.com/create/tokens/new"
                    target="_blank"
                    rel="noopener"
                  >
                    Airtable's token creation page
                  </Link>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Select the scopes: schema.bases:read and data.records:read" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Grant access to the base(s) you want to use" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Copy the generated token (starts with 'pat...')" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Return here and click 'Continue' to enter your credentials" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <Button
          variant="contained"
          href="https://airtable.com/create/tokens/new"
          target="_blank"
          rel="noopener"
          startIcon={<Launch />}
        >
          Create PAT in Airtable
        </Button>
        <Typography variant="body2" color="text.secondary">
          Opens in a new tab
        </Typography>
      </Box>

      <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Keep the token creation page open in another tab so you can easily
          copy your token.
        </Typography>
      </Alert>

      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
        <Button variant="contained" onClick={onContinue} fullWidth>
          I've Created My PAT - Continue
        </Button>
      </Box>
    </Box>
  );
};
