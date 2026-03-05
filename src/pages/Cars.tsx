import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { parse, isValid } from 'date-fns'
import { cars } from '../data/cars'
import type { Car, Category } from '../data/cars'
import CarCard from '../components/CarCard'
import ReservationModal from '../components/ReservationModal'

const CATEGORIES: Category[] = ['Economy', 'Compact', 'SUV', 'Luxury', 'Van']

const filterKeys: Record<string, string> = {
  Economy: 'cars.filterEconomy',
  Compact: 'cars.filterCompact',
  SUV: 'cars.filterSUV',
  Luxury: 'cars.filterLuxury',
  Van: 'cars.filterVan',
}

export default function Cars() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  const pickupDate = useMemo(() => {
    const raw = searchParams.get('from')
    if (!raw) return null
    const d = parse(raw, 'yyyy-MM-dd', new Date())
    return isValid(d) ? d : null
  }, [searchParams])

  const returnDate = useMemo(() => {
    const raw = searchParams.get('to')
    if (!raw) return null
    const d = parse(raw, 'yyyy-MM-dd', new Date())
    return isValid(d) ? d : null
  }, [searchParams])

  const filtered = useMemo(
    () =>
      cars.filter(
        (c) => c.available && (activeCategory === 'All' || c.category === activeCategory)
      ),
    [activeCategory]
  )

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{t('cars.pageTitle')}</h1>
          <p className="text-gray-500 max-w-xl mx-auto">{t('cars.pageSubtitle')}</p>
          {pickupDate && returnDate && (
            <p className="mt-3 text-sm text-brand-600 font-medium">
              {t('cars.availableFrom')}{' '}
              <span className="font-bold">{pickupDate.toLocaleDateString()}</span>
              {' '}{t('cars.to')}{' '}
              <span className="font-bold">{returnDate.toLocaleDateString()}</span>
            </p>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <FilterBtn
            active={activeCategory === 'All'}
            onClick={() => setActiveCategory('All')}
            label={t('cars.filterAll')}
          />
          {CATEGORIES.map((cat) => (
            <FilterBtn
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              label={t(filterKeys[cat])}
            />
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">{t('cars.noCars')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onReserve={(c) => setSelectedCar(c)}
                pickupDate={pickupDate}
                returnDate={returnDate}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCar && (
        <ReservationModal
          car={selectedCar}
          initialPickup={pickupDate}
          initialReturn={returnDate}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </main>
  )
}

function FilterBtn({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400 hover:text-brand-600'
      }`}
    >
      {label}
    </button>
  )
}
