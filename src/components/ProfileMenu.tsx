import React, { useState, useCallback } from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useAuthContext } from "@store/contexts/AuthContext";
import { isSupabaseConfigured } from "@shared/services/supabaseService";
import { useUserProfile } from "@features/auth/hooks/useUserProfile";

interface ProfileMenuProps {
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
}

/**
 * ProfileMenu component for displaying user account information and sign-in options.
 * Shows sign-in buttons when user is not logged in, and profile/logout when logged in.
 */
export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl: externalAnchorEl,
  onClose: externalOnClose,
}) => {
  const { user, signInWithGoogle, signInWithEntreefederatie, logout } = useAuthContext();
  const { profile, loading: profileLoading } = useUserProfile(user);
  const [internalAnchorEl, setInternalAnchorEl] = useState<HTMLElement | null>(null);
  const supabaseConfigured = isSupabaseConfigured();

  // Use external anchor if provided, otherwise use internal state
  const anchorEl = externalAnchorEl ?? internalAnchorEl;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!externalAnchorEl) {
      setInternalAnchorEl(event.currentTarget);
    }
  };

  const handleClose = useCallback(() => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalAnchorEl(null);
    }
  }, [externalOnClose]);

  const handleSignIn = useCallback(() => {
    // Call sign-in first to keep user gesture context active
    void signInWithGoogle();
    // Close the menu afterwards to avoid losing focus/activation before popup
    handleClose();
  }, [signInWithGoogle, handleClose]);

  const handleSignInEntreefederatie = useCallback(() => {
    // Call sign-in first to keep user gesture context active
    void signInWithEntreefederatie();
    // Close the menu afterwards to avoid losing focus/activation before popup
    handleClose();
  }, [signInWithEntreefederatie, handleClose]);

  const handleSignOut = useCallback(async () => {
    handleClose();
    await logout();
  }, [logout, handleClose]);

  const isLoggedIn = user !== null;
  const entreefederatieEnabled = true; // Can be made configurable later

  // Helper functions to get display information
  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (user?.email) return user.email;
    return "User";
  };

  const getAvatarInitial = () => {
    if (profile?.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return null;
  };

  const getAvatarUrl = () => {
    return profile?.photo_url || null;
  };

  const getRoleDisplay = () => {
    if (!profile?.role || profile.role === "anonymous") return null;
    const roleLabels: Record<string, string> = {
      free: "Free",
      premium: "Premium",
      admin: "Admin",
      "super-admin": "Super Admin",
    };
    return roleLabels[profile.role] || profile.role;
  };

  // If no external anchor, render the trigger button
  if (!externalAnchorEl) {
    return (
      <>
        <Tooltip title={isLoggedIn ? "Account" : "Sign in"}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={isLoggedIn ? getAvatarUrl() || undefined : undefined}
              sx={{ width: 32, height: 32 }}
            >
              {isLoggedIn && getAvatarInitial() ? getAvatarInitial() : <PersonIcon />}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 240,
                maxWidth: 280,
              },
            },
          }}
        >
          {isLoggedIn ? (
            [
              <Box key="profile-info" sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={getAvatarUrl() || undefined} sx={{ width: 40, height: 40 }}>
                    {getAvatarInitial() || <PersonIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getDisplayName()}
                      </Typography>
                      {profile?.email_verified && (
                        <VerifiedIcon
                          fontSize="small"
                          color="primary"
                          sx={{ fontSize: 16, flexShrink: 0 }}
                        />
                      )}
                    </Box>
                    {user?.email && user.email !== getDisplayName() && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.email}
                      </Typography>
                    )}
                    {profileLoading && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <CircularProgress size={12} />
                        <Typography variant="caption" color="text.secondary">
                          Loading...
                        </Typography>
                      </Box>
                    )}
                    {profile && (
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                        {getRoleDisplay() && (
                          <Chip
                            label={getRoleDisplay()}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.65rem" }}
                          />
                        )}
                        {profile.remaining_credits !== null &&
                          profile.remaining_credits !== undefined && (
                            <Chip
                              label={`${profile.remaining_credits} credits`}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ height: 20, fontSize: "0.65rem" }}
                            />
                          )}
                        {profile.ef_nl_edu_person_home_organization && (
                          <Chip
                            label={profile.ef_nl_edu_person_home_organization}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.65rem" }}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>,
              <Divider key="divider" />,
              <MenuItem key="sign-out" onClick={handleSignOut}>
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  <LogoutIcon fontSize="small" />
                </Box>
                Sign Out
              </MenuItem>,
            ]
          ) : supabaseConfigured ? (
            [
              <MenuItem key="sign-in-google" onClick={handleSignIn}>
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  <LoginIcon fontSize="small" />
                </Box>
                Sign In with Google
              </MenuItem>,
              entreefederatieEnabled && (
                <MenuItem key="sign-in-entreefederatie" onClick={handleSignInEntreefederatie}>
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <LoginIcon fontSize="small" />
                  </Box>
                  Login met schoolaccount
                </MenuItem>
              ),
            ].filter(Boolean)
          ) : (
            <MenuItem key="not-configured" disabled>
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                <LoginIcon fontSize="small" />
              </Box>
              Supabase not configured
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }

  // External anchor mode - just render the menu
  return (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 240,
            maxWidth: 280,
          },
        },
      }}
    >
      {isLoggedIn ? (
        [
          <Box key="profile-info" sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar src={getAvatarUrl() || undefined} sx={{ width: 40, height: 40 }}>
                {getAvatarInitial() || <PersonIcon />}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getDisplayName()}
                  </Typography>
                  {profile?.email_verified && (
                    <VerifiedIcon
                      fontSize="small"
                      color="primary"
                      sx={{ fontSize: 16, flexShrink: 0 }}
                    />
                  )}
                </Box>
                {user?.email && user.email !== getDisplayName() && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </Typography>
                )}
                {profileLoading && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <CircularProgress size={12} />
                    <Typography variant="caption" color="text.secondary">
                      Loading...
                    </Typography>
                  </Box>
                )}
                {profile && (
                  <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                    {getRoleDisplay() && (
                      <Chip
                        label={getRoleDisplay()}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.65rem" }}
                      />
                    )}
                    {profile.remaining_credits !== null &&
                      profile.remaining_credits !== undefined && (
                        <Chip
                          label={`${profile.remaining_credits} credits`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      )}
                    {profile.ef_nl_edu_person_home_organization && (
                      <Chip
                        label={profile.ef_nl_edu_person_home_organization}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.65rem" }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>,
          <Divider key="divider" />,
          <MenuItem key="sign-out" onClick={handleSignOut}>
            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              <LogoutIcon fontSize="small" />
            </Box>
            Sign Out
          </MenuItem>,
        ]
      ) : supabaseConfigured ? (
        [
          <MenuItem key="sign-in-google" onClick={handleSignIn}>
            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              <LoginIcon fontSize="small" />
            </Box>
            Sign In with Google
          </MenuItem>,
          entreefederatieEnabled && (
            <MenuItem key="sign-in-entreefederatie" onClick={handleSignInEntreefederatie}>
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                <LoginIcon fontSize="small" />
              </Box>
              Login met schoolaccount
            </MenuItem>
          ),
        ].filter(Boolean)
      ) : (
        <MenuItem key="not-configured" disabled>
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            <LoginIcon fontSize="small" />
          </Box>
          Supabase not configured
        </MenuItem>
      )}
    </Menu>
  );
};
