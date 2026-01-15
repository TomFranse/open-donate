/**
 * Setup utilities for managing setup state in localStorage
 */

export type SetupStatus = "not-started" | "in-progress" | "completed" | "skipped";

export type SetupSectionId = "supabase" | "airtable" | "hosting" | "theme";

export interface SetupSectionsState {
  supabase: SetupStatus;
  airtable: SetupStatus;
  hosting: SetupStatus;
  theme: SetupStatus;
}

const STORAGE_KEY = "setup_sections_state";

const DEFAULT_STATE: SetupSectionsState = {
  supabase: "not-started",
  airtable: "not-started",
  hosting: "not-started",
  theme: "not-started",
};

/**
 * Get the current setup sections state from localStorage
 */
export const getSetupSectionsState = (): SetupSectionsState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_STATE;
    }
  }
  return DEFAULT_STATE;
};

/**
 * Update the status of a specific setup section
 */
export const updateSetupSectionStatus = (section: SetupSectionId, status: SetupStatus): void => {
  const currentState = getSetupSectionsState();
  const newState = {
    ...currentState,
    [section]: status,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
};

/**
 * Get list of enabled features (sections marked as completed)
 */
export const getEnabledFeatures = (): SetupSectionId[] => {
  const state = getSetupSectionsState();
  return (Object.keys(state) as SetupSectionId[]).filter((key) => state[key] === "completed");
};

/**
 * Check if setup is complete (all sections are either completed or skipped)
 */
export const isSetupComplete = (): boolean => {
  const state = getSetupSectionsState();
  return Object.values(state).every((status) => status === "completed" || status === "skipped");
};
