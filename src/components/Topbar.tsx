import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuthContext } from "@store/contexts/AuthContext";
import { ProfileMenu } from "@components/ProfileMenu";

/**
 * Topbar component that is always visible.
 * This component is designed to be reusable across all apps.
 */
export const Topbar = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Vite MUI Supabase Starter
          </Link>
        </Typography>

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/todos"
              sx={{
                textDecoration: location.pathname === "/todos" ? "underline" : "none",
              }}
            >
              Todos
            </Button>
          )}
          <Button
            color="inherit"
            component={Link}
            to="/setup"
            sx={{
              textDecoration: location.pathname === "/setup" ? "underline" : "none",
            }}
          >
            Setup
          </Button>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

