# Airtable Improved Setup - Implementation Plan

## 1. Required Information

### External Information
- **Airtable npm package**: Already installed (`airtable: ^0.12.2`)
- **Airtable Meta API**: To get table structure, use REST API endpoint:
  - `GET https://api.airtable.com/v0/meta/bases/{baseId}/tables`
  - Requires Personal Access Token in Authorization header
  - Returns table metadata including fields, types, and options
- **Airtable API Documentation**: 
  - Personal Access Token format: `pat...`
  - Base ID format: `app...`
  - Table ID: Table name (case-sensitive) or table ID

### App Context
- **Architecture**: Feature-based structure with services in `shared/services/`
- **Current Setup Flow**: Single-step dialog with form fields and connection test
- **Cleanup Script**: `scripts/finish-setup.js` removes Airtable files when feature disabled
- **Package Management**: Uses `pnpm`
- **Layer Rules**: Components → Hooks → Services → Shared Services
- **Existing Patterns**: 
  - `useConnectionTest` hook for async testing
  - `ConnectionTestResult` component for displaying results
  - Multi-step dialogs using `SetupDialog` component

### Design Intent
- **Multi-step Setup**: Split into 2-3 steps (credentials → validation → completion)
- **Table Structure Display**: Show retrieved schema to user before finalizing
- **Conditional Cleanup**: Remove Airtable package and code when user skips/doesn't use Airtable

## 2. Existing Functionality

### Current Implementation
- **Airtable Service** (`src/shared/services/airtableService.ts`):
  - Basic connection test (fetches first record)
  - Client initialization
  - Configuration checks
  
- **Setup Components**:
  - `AirtableSection.tsx`: Card and dialog for configuration
  - `AirtableFormFields.tsx`: Form inputs for API key, Base ID, Table ID
  - `AirtableDescription.tsx`: Instructions and requirements
  - `ConnectionTestResult.tsx`: Displays test results
  
- **Hooks**:
  - `useAirtableSetup.ts`: Wraps service calls
  - `useConnectionTest.ts`: Manages async test state
  
- **Cleanup Script** (`scripts/finish-setup.js`):
  - Removes `src/shared/services/airtableService.ts` when Airtable disabled
  - Does NOT remove npm package from `package.json`

### Gaps to Address
1. No table structure retrieval (only basic connection test)
2. Single-step setup (no multi-step flow)
3. Cleanup script doesn't remove npm package dependency
4. No visual display of table schema/structure
5. No separate "finish Airtable setup" step after validation

## 3. User Stories

### User Story 1: Multi-Step Airtable Configuration
**As a** developer setting up the app  
**I want to** configure Airtable in multiple clear steps  
**So that** I can verify my configuration before finalizing

**Acceptance Criteria:**
- Step 1: Enter API Key, Base ID, and Table ID
- Step 2: App validates credentials and retrieves table structure
- Step 3: User reviews table structure and confirms setup
- Each step shows clear progress indication
- User can navigate back to previous steps
- User can skip Airtable setup entirely

### User Story 2: Table Structure Validation
**As a** developer configuring Airtable  
**I want to** see the table structure retrieved from Airtable  
**So that** I can verify the table exists and has the expected fields

**Acceptance Criteria:**
- After entering credentials, app fetches table metadata
- Table structure displayed showing:
  - Table name
  - Field names and types
  - Field options (for select fields, etc.)
- Clear success/error messages
- Loading state during API call
- Error handling for invalid credentials or missing table

### User Story 3: Airtable Package Cleanup
**As a** developer finishing setup  
**I want** Airtable package and code removed if I don't use Airtable  
**So that** my app bundle doesn't include unused dependencies

**Acceptance Criteria:**
- When user skips Airtable setup, cleanup script removes:
  - `airtable` package from `package.json`
  - `src/shared/services/airtableService.ts`
  - Airtable-related setup components
  - Airtable-related hooks
  - Airtable environment variable types
- Cleanup script updates `package.json` correctly
- No broken imports after cleanup

## 4. Implementation Plan Options

### Option 1: Stepper-Based Multi-Step Dialog (Recommended)
**Approach**: Use MUI Stepper component within existing SetupDialog

**Pros:**
- Clear visual progress
- Native MUI component (already in dependencies)
- Maintains existing dialog pattern
- Easy to navigate between steps

**Cons:**
- Slightly more complex component structure
- Requires state management for step navigation

**Implementation:**
- Add `Stepper` component to `AirtableSection.tsx`
- Three steps: "Credentials" → "Validation" → "Complete"
- Step 1: Form fields (existing)
- Step 2: Trigger API call, show loading, display results
- Step 3: Show success message and env variables

### Option 2: Separate Dialog Pages
**Approach**: Replace single dialog with sequential dialogs

**Pros:**
- Simpler per-dialog logic
- Clear separation of concerns

**Cons:**
- More complex state management across dialogs
- Less smooth UX (dialog closes/reopens)
- More code duplication

### Option 3: Inline Multi-Step Form
**Approach**: Single dialog with conditional rendering based on step

**Pros:**
- Simple state management
- No new components needed

**Cons:**
- Less clear progress indication
- Harder to navigate back
- More complex conditional logic

**Recommendation**: Option 1 (Stepper-Based) provides best UX while maintaining code clarity.

## 5. Component/API Design

### New Service Function: `getAirtableTableStructure`
```typescript
// src/shared/services/airtableService.ts
export interface AirtableField {
  id: string;
  name: string;
  type: string;
  options?: Record<string, unknown>;
}

export interface AirtableTableStructure {
  id: string;
  name: string;
  fields: AirtableField[];
}

export const getAirtableTableStructure = async (
  apiKey: string,
  baseId: string,
  tableId: string
): Promise<{ success: boolean; data?: AirtableTableStructure; error?: string }> => {
  // Implementation: Call Airtable Meta API
  // GET https://api.airtable.com/v0/meta/bases/{baseId}/tables
  // Filter for matching tableId
  // Return structure with fields
};
```

### Enhanced Hook: `useAirtableSetup`
```typescript
// src/features/setup/hooks/useAirtableSetup.ts
export const useAirtableSetup = () => {
  const [tableStructure, setTableStructure] = useState<AirtableTableStructure | null>(null);
  const [loadingStructure, setLoadingStructure] = useState(false);
  
  const fetchTableStructure = async (apiKey: string, baseId: string, tableId: string) => {
    // Call service, update state
  };
  
  return {
    isConfigured,
    testAirtableConnection,
    fetchTableStructure,
    tableStructure,
    loadingStructure,
  };
};
```

### New Component: `TableStructureDisplay`
```typescript
// src/features/setup/components/TableStructureDisplay.tsx
interface TableStructureDisplayProps {
  structure: AirtableTableStructure | null;
  loading?: boolean;
  error?: string;
}

export const TableStructureDisplay = ({ structure, loading, error }: TableStructureDisplayProps) => {
  // Display table name, fields with types
  // Show loading spinner when loading
  // Show error message if error
};
```

### Enhanced Component: `AirtableSection` with Stepper
```typescript
// src/features/setup/components/sections/AirtableSection.tsx
const AirtableDialog = ({ open, onClose }: AirtableDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [credentials, setCredentials] = useState({ apiKey: "", baseId: "", tableId: "" });
  
  // Step 0: Enter credentials
  // Step 1: Validate and fetch structure
  // Step 2: Review and complete
  
  return (
    <SetupDialog>
      <Stepper activeStep={activeStep}>
        <Step><StepLabel>Enter Credentials</StepLabel></Step>
        <Step><StepLabel>Validate Connection</StepLabel></Step>
        <Step><StepLabel>Complete Setup</StepLabel></Step>
      </Stepper>
      {/* Step content */}
    </SetupDialog>
  );
};
```

## 6. State & Data Flow

### State Management
- **Local Component State**: Step navigation, form values, loading states
- **Hook State**: Table structure data, connection test results
- **No Global State**: Setup is self-contained

### Data Flow
1. User enters credentials → stored in component state
2. User clicks "Next" → hook calls `fetchTableStructure`
3. Service makes API call → returns structure or error
4. Hook updates state → component displays results
5. User reviews → clicks "Finish" → saves env vars → closes dialog

### Async States
- **Loading**: Show spinner during API calls
- **Success**: Display table structure, enable "Finish" button
- **Error**: Show error message, allow retry or go back
- **Empty**: Initial state, show form

## 7. UI/UX Considerations

### Layout
- **Stepper**: Horizontal at top of dialog
- **Step Content**: Scrollable area below stepper
- **Actions**: Back/Next/Finish buttons at bottom

### Responsive Strategy
- Stepper: Horizontal on desktop, vertical on mobile
- Table structure: Scrollable table/card list
- Dialog: Already responsive (existing SetupDialog)

### Interactive States
- **Form Fields**: Disabled during validation step
- **Next Button**: Disabled until credentials filled
- **Finish Button**: Disabled until structure validated
- **Back Button**: Enabled on steps 1+ to go back

### Empty/Loading States
- **Loading**: CircularProgress spinner with "Fetching table structure..."
- **Error**: Alert with error message and "Retry" button
- **Empty Structure**: Message "No fields found in table"

## 8. Accessibility Planning

### Keyboard Interactions
- **Tab**: Navigate through form fields and buttons
- **Enter**: Submit form or proceed to next step
- **Escape**: Close dialog (existing behavior)
- **Arrow Keys**: Navigate stepper (if using MUI Stepper with keyboard support)

### ARIA Attributes
- `aria-label` on stepper steps
- `aria-live` region for loading/error messages
- `aria-busy` on loading states
- `role="table"` for structure display

### Focus Management
- Focus first field when dialog opens
- Focus error message when error occurs
- Focus "Finish" button when step 2 completes successfully

### Semantic HTML
- Use `<table>` for structure display (if appropriate)
- Use `<form>` for credential inputs
- Proper heading hierarchy

## 9. Technical Considerations

### Pseudo-code for Table Structure Fetching
```typescript
async function getAirtableTableStructure(apiKey, baseId, tableId) {
  try {
    // Call Airtable Meta API
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const table = data.tables.find(t => 
      t.name === tableId || t.id === tableId
    );
    
    if (!table) {
      throw new Error(`Table "${tableId}" not found`);
    }
    
    return {
      success: true,
      data: {
        id: table.id,
        name: table.name,
        fields: table.fields.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          options: f.options
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

### New Components
- **TableStructureDisplay**: 
  - Location: `src/features/setup/components/TableStructureDisplay.tsx`
  - Purpose: Display table schema
  - Reusability: Setup-specific, not reusable

### Performance
- **Bundle Size**: No new heavy dependencies (using existing MUI Stepper)
- **API Calls**: Single call per setup (cached in component state)
- **Rendering**: Minimal re-renders (local state management)

### Error Scenarios
1. **Invalid API Key**: 401 Unauthorized → Show error, allow retry
2. **Invalid Base ID**: 404 Not Found → Show error, allow edit
3. **Table Not Found**: Table ID doesn't match → Show error, allow edit
4. **Network Error**: Fetch fails → Show error, allow retry
5. **Rate Limit**: 429 Too Many Requests → Show error, suggest waiting

### Dependencies
- **New**: None (MUI Stepper already available)
- **Existing**: `airtable` package (already installed)

### Integration Points
- **Service Layer**: Add function to `airtableService.ts`
- **Hook Layer**: Enhance `useAirtableSetup.ts`
- **Component Layer**: Modify `AirtableSection.tsx`
- **Cleanup Script**: Update `finish-setup.js` to remove package

### Impact on Existing Functionality
- **Breaking Changes**: None (backward compatible)
- **Migration**: Existing setups continue to work
- **Testing**: Need to test multi-step flow

## 10. Cleanup Script Updates

### Files to Remove When Airtable Disabled
```javascript
// scripts/finish-setup.js
function removeAirtableFiles() {
  const files = [
    "src/shared/services/airtableService.ts",
    "src/features/setup/components/AirtableDescription.tsx",
    "src/features/setup/components/AirtableFormFields.tsx",
    "src/features/setup/components/TableStructureDisplay.tsx", // New
    "src/features/setup/hooks/useAirtableSetup.ts",
    "src/features/setup/components/sections/AirtableSection.tsx",
  ];
  
  // Also remove from package.json
  removePackageDependency("airtable");
}
```

### Package.json Update Function
```javascript
function removePackageDependency(packageName) {
  const packagePath = join(projectRoot, "package.json");
  const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
  
  // Remove from dependencies
  if (packageJson.dependencies?.[packageName]) {
    delete packageJson.dependencies[packageName];
  }
  
  // Remove from devDependencies
  if (packageJson.devDependencies?.[packageName]) {
    delete packageJson.devDependencies[packageName];
  }
  
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
}
```

## 11. Validation & Testing Plan

### How to Validate Correctness
1. **Manual Testing**:
   - Enter valid credentials → verify structure fetched
   - Enter invalid credentials → verify error shown
   - Skip Airtable → verify cleanup removes package
   - Complete setup → verify env vars saved

### Key Test Cases (Vitest)
```typescript
// src/shared/services/airtableService.test.ts
describe("getAirtableTableStructure", () => {
  it("should fetch table structure successfully", async () => {
    // Mock fetch, verify structure returned
  });
  
  it("should handle invalid API key", async () => {
    // Mock 401 response, verify error
  });
  
  it("should handle table not found", async () => {
    // Mock response without matching table, verify error
  });
});

// src/features/setup/components/sections/AirtableSection.test.tsx
describe("AirtableSection", () => {
  it("should navigate through steps", () => {
    // Test step navigation
  });
  
  it("should display table structure after validation", () => {
    // Test structure display
  });
});
```

### Manual Testing Steps
1. Start dev server: `pnpm dev`
2. Navigate to setup page
3. Click "Configure Airtable"
4. Enter credentials → click "Next"
5. Verify structure loads and displays
6. Click "Finish" → verify env vars shown
7. Skip Airtable → run cleanup → verify package removed

## 12. Architecture Compliance

### File Placements (Validated)
- ✅ Service: `src/shared/services/airtableService.ts` (shared service)
- ✅ Hook: `src/features/setup/hooks/useAirtableSetup.ts` (feature hook)
- ✅ Component: `src/features/setup/components/TableStructureDisplay.tsx` (feature component)
- ✅ Section: `src/features/setup/components/sections/AirtableSection.tsx` (feature section)

### Layer Boundaries
- ✅ Components import hooks (not services directly)
- ✅ Hooks import services
- ✅ Services are pure functions
- ✅ No circular dependencies

### Complexity Check
- Service function: ~30 lines (within limit)
- Component: ~150 lines (within limit)
- Hook: ~40 lines (within limit)

## 13. Files to Create

1. `src/features/setup/components/TableStructureDisplay.tsx` - Display table schema
2. `documentation/jobs/temp_job_airtable_improved_setup.md` - This file

## 14. Files to Modify

1. `src/shared/services/airtableService.ts` - Add `getAirtableTableStructure` function
2. `src/features/setup/hooks/useAirtableSetup.ts` - Add structure fetching logic
3. `src/features/setup/components/sections/AirtableSection.tsx` - Add stepper and multi-step flow
4. `scripts/finish-setup.js` - Add package removal and additional file cleanup
5. `src/vite-env.d.ts` - Already has Airtable types (no change needed)

## 15. Implementation Order

1. Add `getAirtableTableStructure` to service (with tests)
2. Enhance `useAirtableSetup` hook with structure fetching
3. Create `TableStructureDisplay` component
4. Update `AirtableSection` with stepper and multi-step flow
5. Update cleanup script to remove package and additional files
6. Test end-to-end flow
7. Update documentation

## 16. Open Questions / Decisions Needed

1. **Stepper vs Separate Dialogs**: Recommend stepper (Option 1)
2. **Structure Display Format**: Table, cards, or list? (Recommend: Cards with field details)
3. **Error Recovery**: Allow editing credentials on error step or force back navigation? (Recommend: Allow editing)
4. **Package Removal**: Remove immediately or prompt user? (Recommend: Remove immediately when skipped)

---

**Status**: Ready for user confirmation and approval
