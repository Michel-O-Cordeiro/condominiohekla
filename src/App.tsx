import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Dashboard } from '@/pages/Dashboard'
import { Reservations } from '@/pages/Reservations'
import { Incidents } from '@/pages/Incidents'
import { Delinquencies } from '@/pages/Delinquencies'
import { WorkOrders } from '@/pages/WorkOrders'
import { MainLayout } from '@/layouts/MainLayout'
import { useAuthStore } from '@/stores/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <MainLayout>{children}</MainLayout>
}

function App() {
  const { isAuthenticated } = useAuthStore()
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        } />
        <Route path="/incidents" element={
          <ProtectedRoute>
            <Incidents />
          </ProtectedRoute>
        } />
        <Route path="/delinquencies" element={
          <ProtectedRoute>
            <Delinquencies />
          </ProtectedRoute>
        } />
        <Route path="/work-orders" element={
          <ProtectedRoute>
            <WorkOrders />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
