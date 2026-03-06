import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { Search, Car, MessageSquare, Shield, Tag, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredCarIds } from '../data/cars'
import { getVehicles } from '../utils/storage'
import CarCard from '../components/CarCard'
import ReservationModal from '../components/ReservationModal'
import type { Car as CarType } from '../data/cars'

export default function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null)

  const featuredCars = featuredCarIds.map((id) => getVehicles().find((c) => c.id === id)).filter(Boolean) as CarType[]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (pickupDate) params.set('from', format(pickupDate, 'yyyy-MM-dd'))
    if (returnDate) params.set('to', format(returnDate, 'yyyy-MM-dd'))
    navigate(`/cars?${params.toString()}`)
  }

  const whyItems = [
    { icon: <Car className="w-8 h-8" />, titleKey: 'landing.why1Title', descKey: 'landing.why1Desc' },
    { icon: <MessageSquare className="w-8 h-8" />, titleKey: 'landing.why2Title', descKey: 'landing.why2Desc' },
    { icon: <Shield className="w-8 h-8" />, titleKey: 'landing.why3Title', descKey: 'landing.why3Desc' },
    { icon: <Tag className="w-8 h-8" />, titleKey: 'landing.why4Title', descKey: 'landing.why4Desc' },
  ]

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&auto=format&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-brand-900/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Pickup */}
              <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t('landing.searchPickup')}
                </p>
                <DatePicker
                  selected={pickupDate}
                  onChange={(d) => setPickupDate(d)}
                  selectsStart
                  startDate={pickupDate ?? undefined}
                  endDate={returnDate ?? undefined}
                  minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="w-full text-gray-900 font-medium text-sm outline-none"
                />
              </div>

              {/* Return */}
              <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t('landing.searchReturn')}
                </p>
                <DatePicker
                  selected={returnDate}
                  onChange={(d) => setReturnDate(d)}
                  selectsEnd
                  startDate={pickupDate ?? undefined}
                  endDate={returnDate ?? undefined}
                  minDate={pickupDate ?? new Date()}
                  dateFormat="dd MMM yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="w-full text-gray-900 font-medium text-sm outline-none"
                />
              </div>

              {/* Button */}
              <button
                onClick={handleSearch}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                {t('landing.searchButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Cars ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {t('landing.featuredTitle')}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('landing.featuredSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onReserve={(c) => setSelectedCar(c)}
                pickupDate={pickupDate}
                returnDate={returnDate}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/cars" className="btn-primary">
              {t('landing.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
            {t('landing.whyTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map(({ icon, titleKey, descKey }) => (
              <div key={titleKey} className="text-center p-6 rounded-2xl hover:bg-brand-50 transition-colors group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 group-hover:bg-brand-200 text-brand-600 rounded-2xl mb-4 transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t(titleKey)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-brand-200 text-lg mb-8">{t('landing.ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars" className="btn-primary bg-white text-brand-700 hover:bg-brand-50">
              {t('landing.ctaBrowse')}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-outline-white">
              {t('landing.ctaContact')}
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation modal */}
      {selectedCar && (
        <ReservationModal
          car={selectedCar}
          initialPickup={pickupDate}
          initialReturn={returnDate}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </>
  )
}
