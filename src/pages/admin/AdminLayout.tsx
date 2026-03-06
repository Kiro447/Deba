import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Car, CalendarCheck, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-800 text-white flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-brand-700">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-brand-300" />
            <span className="font-bold text-sm tracking-wide">Deba Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SideLink to="/admin" end icon={<LayoutDashboard className="w-4 h-4" />} label={t('admin.dashboard')} />
          <SideLink to="/admin/reservations" icon={<CalendarCheck className="w-4 h-4" />} label={t('admin.reservations')} />
          <SideLink to="/admin/vehicles/new" icon={<PlusCircle className="w-4 h-4" />} label={t('admin.addVehicle')} />
        </nav>

        <div className="px-3 py-4 border-t border-brand-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-brand-200 hover:bg-brand-700 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

function SideLink({
  to,
  end,
  icon,
  label,
}: {
  to: string
  end?: boolean
  icon: React.ReactNode
  label: string
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-brand-700 text-white font-semibold'
            : 'text-brand-200 hover:bg-brand-700 hover:text-white'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
