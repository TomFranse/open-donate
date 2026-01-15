import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { ProfileMenu } from "@/components/common/ProfileMenu";
import logoImage from "@/assets/SV_Logo2015_ZW-1024x630.png";

/**
 * Topbar component that is always visible.
 * This component is designed to be reusable across all apps.
 * Note: Currently hidden in App.tsx for donation page
 */
export const Topbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexGrow: 1,
            "&:hover": {
              textDecoration: "none",
            },
          }}
        >
          <Box
            component="img"
            src={logoImage}
            alt="Stichting Vluchteling"
            sx={{
              height: 40,
              width: "auto",
            }}
          />
        </Box>

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button component={Link} to="/setup">
            Setup
          </Button>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
