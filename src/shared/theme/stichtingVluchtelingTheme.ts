/**
 * Stichting Vluchteling Theme Configuration
 *
 * This theme uses the brand colors from Stichting Vluchteling website (https://steun.vluchteling.nl/).
 * Primary color is a bright golden yellow, with light backgrounds and dark text.
 *
 * Structure:
 * - palette: All color definitions (primary, secondary, background, text, etc.)
 * - typography: Font families, sizes, weights for all text elements
 * - components: MUI component style overrides
 *
 * Principles:
 * - Use palette references instead of hardcoded colors where possible
 * - All component styling should be defined here, not in individual components
 * - Use sx prop in components only for layout/spacing, not colors/styling
 */

import { createTheme, ThemeOptions, Theme, alpha } from "@mui/material/styles";

// Color constants - Stichting Vluchteling brand colors
// Based on https://steun.vluchteling.nl/
const COLORS = {
  primary: "#FDC93F", // Bright golden yellow - primary brand color
  secondary: "#E6A800", // Darker yellow/gold for secondary elements
  background: {
    default: "#FFFFFF", // White background
    paper: "#F5F5F5", // Light grey for paper/cards
    grey: "#6B6B6B", // Grey for footer/secondary backgrounds (like footer-bottom-columns)
  },
  text: {
    primary: "#000000", // Black text
    secondary: "#333333", // Dark grey for secondary text
    onYellow: "#000000", // Black text on yellow (ensures readability)
    onGrey: "#FFFFFF", // White text on grey backgrounds
  },
  grey: {
    main: "#6B6B6B", // Grey for outlined buttons and secondary elements
    light: "#9B9B9B", // Lighter grey
    dark: "#4A4A4A", // Darker grey
  },
  gradient: {
    start: "#FFD700", // Gold start
    end: "#FDC93F", // Yellow end
  },
} as const;

export const stichtingVluchtelingThemeOptions: ThemeOptions = {
  palette: {
    mode: "light", // Light theme to match Stichting Vluchteling website
    primary: {
      main: COLORS.primary,
      light: "#FFE066", // Lighter yellow
      dark: "#E6A800", // Darker yellow/gold
      contrastText: COLORS.text.primary, // Black text on yellow
    },
    secondary: {
      main: COLORS.secondary,
      light: "#FFD700", // Lighter gold
      dark: "#CC8800", // Darker gold
      contrastText: COLORS.text.primary, // Black text on secondary
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: COLORS.grey.main, // Main grey (#6B6B6B)
      600: COLORS.grey.dark, // Darker grey (#4A4A4A)
      700: "#424242",
      800: "#212121",
      900: "#121212",
    },
    background: {
      default: COLORS.background.default,
      paper: COLORS.background.paper,
    },
    text: {
      primary: COLORS.text.primary, // Black text on white
      secondary: COLORS.text.secondary, // Dark grey for secondary text
    },
  },
  typography: {
    // Using Roboto Condensed as a free alternative to Berthold Extra Condensed
    // Similar condensed, modern sans-serif style
    fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Roboto Condensed", "Roboto", sans-serif',
      fontWeight: 700,
    },
    // Use MUI's built-in body2 variant for code text (0.875rem)
    body2: {
      fontSize: "0.875rem",
    },
    // Use MUI's built-in caption variant for small text
    // Customize fontSize to 0.65rem for small chips
    caption: {
      fontSize: "0.65rem",
    },
  },
  components: {
    // AppBar styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "background.paper",
          color: "text.primary",
        },
      },
    },
    // Toolbar styling
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
        },
      },
    },
    // Link styling - handles all anchor tags and Link components
    MuiLink: {
      styleOverrides: {
        root: {
          color: COLORS.text.primary, // Black text for readability
          textDecoration: "none",
          "&:hover": {
            color: COLORS.primary, // Yellow on hover
            textDecoration: "none",
          },
        },
      },
    },
    // Button styling
    // All button styling is centralized here. Variants determine colors automatically:
    // - contained: uses primary yellow color (main actions)
    // - outlined: uses grey color (secondary actions, matching footer style)
    // - text: uses primary yellow color (text buttons)
    // Components should NOT specify color prop - variant handles it.
    MuiButton: {
      defaultProps: {
        color: "primary", // Default color for all buttons
      },
      styleOverrides: {
        root: {
          borderRadius: 0, // No rounded buttons - square corners like Stichting Vluchteling website
          height: 48,
          padding: "8px 24px",
        },
        // Contained variant: primary yellow color (main actions)
        contained: {
          background: COLORS.primary,
          border: 0,
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.2)",
          color: COLORS.text.onYellow, // Black text on yellow for readability
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: COLORS.secondary, // Darker yellow on hover
            boxShadow: "0 4px 6px 3px rgba(0, 0, 0, 0.3)",
            color: COLORS.text.onYellow, // Ensure black text remains readable
          },
          "&:active": {
            boxShadow: "0 2px 4px 1px rgba(0, 0, 0, 0.3)",
          },
        },
        // Text variant: primary yellow color
        text: {
          color: COLORS.primary,
          "&:hover": {
            backgroundColor: alpha(COLORS.primary, 0.1), // Light yellow background on hover
            color: COLORS.primary, // Keep yellow text
          },
        },
        // Outlined variant: grey border (matching footer-bottom-columns style)
        // Grey background and white text, like the footer
        outlined: {
          borderColor: COLORS.grey.main,
          color: COLORS.text.onGrey, // White text on grey
          backgroundColor: COLORS.grey.main, // Grey background like footer
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: COLORS.grey.dark, // Darker grey on hover
            color: COLORS.text.onGrey, // Keep white text
            borderColor: COLORS.grey.dark,
          },
        },
      },
    },
    // CssBaseline customization - handles global styles
    MuiCssBaseline: {
      styleOverrides: {
        code: ({ theme }: { theme: Theme }) => ({
          fontFamily: theme.typography.fontFamily, // Use Roboto Condensed for consistency
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }),
        pre: ({ theme }: { theme: Theme }) => ({
          fontFamily: theme.typography.fontFamily, // Use Roboto Condensed for consistency
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }),
        "*": {
          boxSizing: "border-box",
          // Firefox scrollbar styling
          scrollbarWidth: "thin",
          scrollbarColor: `${alpha(COLORS.primary, 0.3)} transparent`,
        },
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(COLORS.primary, 0.3),
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: alpha(COLORS.primary, 0.5),
          },
        },
        body: {
          margin: 0,
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          overflowX: "hidden", // Prevent horizontal scroll
        },
        html: {
          overflowX: "hidden", // Prevent horizontal scroll
        },
      },
    },
    // Typography component styling - handles code elements via component="code"
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          "& code": {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            padding: "2px 4px",
            borderRadius: 0, // No rounded corners
            fontSize: theme.typography.body2.fontSize,
            fontFamily: theme.typography.fontFamily, // Use Roboto Condensed for consistency
          },
        }),
      },
    },
    // Chip component styling - small chips with custom height
    MuiChip: {
      styleOverrides: {
        sizeSmall: ({ theme }: { theme: Theme }) => ({
          height: 20, // Fixed height for small chips
          fontSize: theme.typography.caption.fontSize,
        }),
      },
    },
    // Card styling - no rounded corners
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // No rounded cards - square corners like Stichting Vluchteling website
        },
      },
    },
    // Paper component styling - also used for card-like surfaces
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0, // No rounded corners for paper surfaces
        },
      },
    },
  },
};

export const stichtingVluchtelingTheme = createTheme(stichtingVluchtelingThemeOptions);
