/**
 * Theme Loader - Theme Persistence and Loading
 *
 * Handles loading themes from localStorage and provides utilities for theme management.
 * Supports custom themes that override the Stichting Vluchteling theme configuration.
 *
 * Storage:
 * - Custom themes are stored in localStorage under the key "custom_mui_theme"
 * - Themes are stored as JSON strings
 *
 * Functions:
 * - loadTheme(): Loads custom theme from localStorage or returns Stichting Vluchteling theme
 * - getCustomTheme(): Retrieves custom theme from localStorage
 * - saveCustomTheme(options): Saves custom theme to localStorage
 * - removeCustomTheme(): Removes custom theme and reverts to Stichting Vluchteling theme
 * - validateThemeOptions(json): Validates theme JSON and returns validation result
 */

import { createTheme, ThemeOptions } from "@mui/material/styles";
import { stichtingVluchtelingThemeOptions } from "./stichtingVluchtelingTheme";

const CUSTOM_THEME_STORAGE_KEY = "custom_mui_theme";

/**
 * Get custom theme from localStorage
 * @returns ThemeOptions if found, null otherwise
 */
export const getCustomTheme = (): ThemeOptions | null => {
  try {
    const stored = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ThemeOptions;
    }
  } catch {
    // Silently fail and return null to use Stichting Vluchteling theme
  }
  return null;
};

/**
 * Save custom theme to localStorage
 * @param themeOptions - Theme options to save
 *
 * Note: This function does NOT automatically sync to app.config.json.
 * Call syncConfiguration() separately after saving theme if needed.
 */
export const saveCustomTheme = (themeOptions: ThemeOptions): void => {
  try {
    localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(themeOptions));
  } catch {
    // Silently fail - storage quota may be exceeded
  }
};

/**
 * Remove custom theme (revert to Stichting Vluchteling theme)
 *
 * Note: This function does NOT automatically sync to app.config.json.
 * Call syncConfiguration() separately after removing theme if needed.
 */
export const removeCustomTheme = (): void => {
  localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY);
};

/**
 * Load theme - custom theme if available, otherwise Stichting Vluchteling theme
 * @returns Created MUI theme instance
 */
export const loadTheme = () => {
  const customTheme = getCustomTheme();
  if (customTheme) {
    return createTheme(customTheme);
  }
  // Use Stichting Vluchteling theme instead of default theme
  return createTheme(stichtingVluchtelingThemeOptions);
};

/**
 * Validate theme options JSON string
 * @param themeJson - JSON string to validate
 * @returns Validation result with error message if invalid, or theme object if valid
 */
export const validateThemeOptions = (
  themeJson: string
): { valid: boolean; error?: string; theme?: ThemeOptions } => {
  try {
    const parsed = JSON.parse(themeJson);

    // Basic validation - check if it has palette or other theme properties
    if (typeof parsed !== "object" || parsed === null) {
      return { valid: false, error: "Theme must be a valid object" };
    }

    // Try to create theme to validate
    createTheme(parsed as ThemeOptions);

    return { valid: true, theme: parsed as ThemeOptions };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid theme JSON",
    };
  }
};
