import { MenuItem, Box } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

interface SignInMenuItemsProps {
  onSignInWithGoogle: () => void;
}

export const SignInMenuItems = ({ onSignInWithGoogle }: SignInMenuItemsProps) => {
  return (
    <MenuItem key="sign-in-google" onClick={onSignInWithGoogle}>
      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
        <LoginIcon fontSize="small" />
      </Box>
      Sign In with Google
    </MenuItem>
  );
};
