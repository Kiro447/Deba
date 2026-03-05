import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Car, Phone, Mail, MapPin } from 'lucide-react'
import { BUSINESS } from '../data/config'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <Car className="w-6 h-6 text-brand-400" />
              <span>{BUSINESS.name}</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">{t('footer.tagline')}</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                {BUSINESS.email}
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                {BUSINESS.address}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-3">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/cars', label: t('nav.cars') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-3">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          © {year} {BUSINESS.name}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
