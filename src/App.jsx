import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SolicitarViaje } from './pages/SolicitarViaje';
import { MisViajes } from './pages/MisViajes';
import { ViajeDetalle } from './pages/ViajeDetalle';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { SetPassword } from './pages/SetPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/set-password/:token" element={<SetPassword />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/viajes"
            element={
              <ProtectedRoute>
                <Layout>
                  <MisViajes />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/solicitar-viaje"
            element={
              <ProtectedRoute>
                <Layout>
                  <SolicitarViaje />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/viajes/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ViajeDetalle />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
