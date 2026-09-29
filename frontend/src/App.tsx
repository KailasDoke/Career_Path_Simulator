import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './features/auth/Login';

// Lazy-loaded route components for performance
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const ProfileBuilder = lazy(() => import('./features/profile/ProfileBuilder'));
const AssessmentEngine = lazy(() => import('./features/assessment/AssessmentEngine'));
const AssessmentResults = lazy(() => import('./features/assessment/AssessmentResults'));
const PathwayDashboard = lazy(() => import('./features/pathways/PathwayDashboard'));
const FinanceDashboard = lazy(() => import('./features/finance/FinanceDashboard'));
const SimulationDashboard = lazy(() => import('./features/simulation/SimulationDashboard'));
const CopilotChat = lazy(() => import('./features/copilot/CopilotChat'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
      <p className="font-bold tracking-widest uppercase text-sm">Preparing...</p>
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            <Route element={<AppLayout />}>
              {/* Public/Hybrid Route */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfileBuilder />} />
                <Route path="/assessment" element={<AssessmentEngine />} />
                <Route path="/assessment/results" element={<AssessmentResults />} />
                <Route path="/pathways" element={<PathwayDashboard />} />
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/simulate" element={<SimulationDashboard />} />
                <Route path="/copilot" element={<CopilotChat />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-4xl font-bold mb-4 text-gray-900">404</h2>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <a href="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-500 transition-colors">
        Go Home
      </a>
    </div>
  )
}

export default App;
