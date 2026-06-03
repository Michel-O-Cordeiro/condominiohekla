import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Dashboard } from '@/pages/Dashboard'
import { Reservations } from '@/pages/Reservations'
import { Incidents } from '@/pages/Incidents'
import { Delinquencies } from '@/pages/Delinquencies'
import { WorkOrders } from '@/pages/WorkOrders'
import { Cashier } from '@/pages/Cashier'
import { MainLayout } from '@/layouts/MainLayout'
import { useAuthStore, useInitializeAuth } from '@/stores/authStore'
import { useThemeStore, useInitializeTheme } from '@/stores/themeStore'
import { useInitializeReservations } from '@/stores/reservationStore'
import { useInitializeIncidents } from '@/stores/incidentStore'
import { useInitializeDelinquencies } from '@/stores/delinquencyStore'
import { useInitializeWorkOrders } from '@/stores/workOrderStore'
import { useInitializeTransactions } from '@/stores/cashStore'
import { ToastProvider } from '@/components/ToastContainer'
import { useEffect } from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <MainLayout>{children}</MainLayout>
}

function App() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { theme } = useThemeStore()
  
  useInitializeAuth()
  useInitializeTheme()
  useInitializeReservations()
  useInitializeIncidents()
  useInitializeDelinquencies()
  useInitializeWorkOrders()
  useInitializeTransactions()
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    )
  }
  
  return (
    <ToastProvider>
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
          <Route path="/cashier" element={
            <ProtectedRoute>
              <Cashier />
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
    </ToastProvider>
  )
}

export default App
