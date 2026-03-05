import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Car, Globe } from 'lucide-react'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'mk' : 'en')
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/cars', label: t('nav.cars') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
            <Car className="w-7 h-7" />
            <span>Deba</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-gray-600 hover:text-brand-700 hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-700 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
              title="Switch language"
            >
              <Globe className="w-4 h-4" />
              {i18n.language === 'en' ? 'MK' : 'EN'}
            </button>
            <Link to="/cars" className="btn-primary text-sm py-2 px-4">
              {t('nav.reserveNow')}
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="p-2 text-gray-600 hover:text-brand-700"
              title="Switch language"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-brand-700"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-gray-600 hover:text-brand-700 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/cars"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full justify-center mt-3 text-sm py-2.5"
          >
            {t('nav.reserveNow')}
          </Link>
        </div>
      )}
    </nav>
  )
}
