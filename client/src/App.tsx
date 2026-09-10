import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { PediatricProvider } from "./context/PediatricContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { LandingPage } from "./pages/LandingPage";
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard";
import { IntakePage } from "./pages/IntakePage";
import { SpecialistRecommendationPage } from "./pages/SpecialistRecommendationPage";
import { MasterHealthRecordPage } from "./pages/MasterHealthRecordPage";
import { AlertsClosurePage } from "./pages/AlertsClosurePage";
import { ClinicalLayout } from "./components/ClinicalLayout";
import { SpecialistWorkspacePage } from "./pages/SpecialistWorkspacePage";
import { ParentPortal } from "./pages/ParentPortal";
import { MasterDataAdminPage } from "./pages/MasterDataAdminPage";
import { KnowledgeRepositoryPage } from "./pages/KnowledgeRepositoryPage";
import { MultidisciplinaryWorkspacePage } from "./pages/MultidisciplinaryWorkspacePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<ClinicalLayout />}>
        {/* Executive / Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Executive", "Admin"]} />}>
          <Route path="/dashboard" element={<ExecutiveDashboard />} />
          <Route path="/admin" element={<MasterDataAdminPage />} />
          <Route path="/repository" element={<KnowledgeRepositoryPage />} />
        </Route>
        
        {/* Intake / Triage Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Nurse", "Pediatrician"]} />}>
          <Route path="/intake" element={<IntakePage />} />
        </Route>

        {/* Clinical Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Pediatrician"]} />}>
          <Route path="/recommendation" element={<SpecialistRecommendationPage />} />
        </Route>

        {/* Specialist Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Specialist"]} />}>
          <Route path="/specialist-workspace" element={<SpecialistWorkspacePage />} />
          <Route path="/mdt" element={<MultidisciplinaryWorkspacePage />} />
        </Route>

        {/* Shared Clinical Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Nurse", "Pediatrician", "Specialist", "Executive"]} />}>
          <Route path="/patients/:id" element={<MasterHealthRecordPage />} />
          <Route path="/patients" element={<Navigate to="/patients/PT-1001" replace />} />
          <Route path="/alerts" element={<AlertsClosurePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
        <Route path="/guardian" element={<ParentPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PediatricProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PediatricProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
