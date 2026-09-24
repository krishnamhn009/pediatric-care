import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { PediatricProvider } from "./context/PediatricContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import { ClinicalLayout } from "./components/ClinicalLayout";
import { Skeleton } from "@/components/ui/skeleton";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then(m => ({ default: m.LandingPage }))
);
const ExecutiveDashboard = lazy(() =>
  import("./pages/ExecutiveDashboard").then(m => ({
    default: m.ExecutiveDashboard,
  }))
);
const IntakePage = lazy(() =>
  import("./pages/IntakePage").then(m => ({ default: m.IntakePage }))
);
const SpecialistRecommendationPage = lazy(() =>
  import("./pages/SpecialistRecommendationPage").then(m => ({
    default: m.SpecialistRecommendationPage,
  }))
);
const MasterHealthRecordPage = lazy(() =>
  import("./pages/MasterHealthRecordPage").then(m => ({
    default: m.MasterHealthRecordPage,
  }))
);
const AlertsClosurePage = lazy(() =>
  import("./pages/AlertsClosurePage").then(m => ({
    default: m.AlertsClosurePage,
  }))
);
const SpecialistWorkspacePage = lazy(() =>
  import("./pages/SpecialistWorkspacePage").then(m => ({
    default: m.SpecialistWorkspacePage,
  }))
);
const ParentPortal = lazy(() =>
  import("./pages/ParentPortal").then(m => ({ default: m.ParentPortal }))
);
const ParentDashboard = lazy(() =>
  import("./pages/ParentDashboard").then(m => ({ default: m.ParentDashboard }))
);
const MasterDataAdminPage = lazy(() =>
  import("./pages/MasterDataAdminPage").then(m => ({
    default: m.MasterDataAdminPage,
  }))
);
const KnowledgeRepositoryPage = lazy(() =>
  import("./pages/KnowledgeRepositoryPage").then(m => ({
    default: m.KnowledgeRepositoryPage,
  }))
);
const MultidisciplinaryWorkspacePage = lazy(() =>
  import("./pages/MultidisciplinaryWorkspacePage").then(m => ({
    default: m.MultidisciplinaryWorkspacePage,
  }))
);
const PatientListPage = lazy(() =>
  import("./pages/PatientListPage").then(m => ({ default: m.PatientListPage }))
);

function PageFallback() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-8">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<ClinicalLayout />}>
          {/* Executive / Admin Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["Executive", "Admin"]} />}
          >
            <Route path="/dashboard" element={<ExecutiveDashboard />} />
            <Route path="/admin" element={<MasterDataAdminPage />} />
            <Route path="/repository" element={<KnowledgeRepositoryPage />} />
          </Route>

          {/* Intake / Triage Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["Nurse", "Pediatrician"]} />
            }
          >
            <Route path="/intake" element={<IntakePage />} />
          </Route>

          {/* Clinical Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Pediatrician"]} />}>
            <Route
              path="/recommendation"
              element={<SpecialistRecommendationPage />}
            />
          </Route>

          {/* Specialist Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Specialist"]} />}>
            <Route
              path="/specialist-workspace"
              element={<SpecialistWorkspacePage />}
            />
            <Route path="/mdt" element={<MultidisciplinaryWorkspacePage />} />
          </Route>

          {/* Shared Clinical Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Nurse",
                  "Pediatrician",
                  "Specialist",
                  "Executive",
                ]}
              />
            }
          >
            <Route path="/patients" element={<PatientListPage />} />
            <Route path="/patients/:id" element={<MasterHealthRecordPage />} />
            <Route path="/alerts" element={<AlertsClosurePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
          <Route path="/guardian" element={<ParentPortal />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route
            path="/parent"
            element={<Navigate to="/parent/dashboard" replace />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <PediatricProvider>
            <TooltipProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </PediatricProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
