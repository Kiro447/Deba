import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Cars from './pages/Cars'
import About from './pages/About'
import Contact from './pages/Contact'
import CookieBanner from './components/CookieBanner'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVehicleForm from './pages/admin/AdminVehicleForm'
import { loadGA } from './utils/analytics'

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicShell() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
      <Footer />
      <CookieBanner />
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (localStorage.getItem('deba_cookie_consent') === 'accepted') {
      loadGA()
    }
  }, [])

  if (isAdmin) {
    return (
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles/new" element={<AdminVehicleForm />} />
            <Route path="vehicles/:id/edit" element={<AdminVehicleForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <PublicShell />
    </AuthProvider>
  )
}
