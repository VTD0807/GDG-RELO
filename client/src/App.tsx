import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerView } from './pages/CustomerView';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#121212]"></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerView />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/register" 
        element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
