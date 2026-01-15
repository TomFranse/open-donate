import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "@/shared/context/AuthContext";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { HomePage } from "@pages/HomePage";
import { AuthCallbackPage } from "@pages/AuthCallbackPage";
import { getBasePathForRouter } from "@/shared/utils/basePath";

function AppContent() {
  return (
    <>
      {/* Topbar is hidden for donation page */}
      <Box>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={getBasePathForRouter()}>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
