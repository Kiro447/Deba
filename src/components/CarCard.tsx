import { useTranslation } from 'react-i18next'
import { Users, DoorOpen, Zap, Calendar, Fuel, Settings } from 'lucide-react'
import type { Car } from '../data/cars'

interface CarCardProps {
  car: Car
  onReserve: (car: Car) => void
  pickupDate?: Date | null
  returnDate?: Date | null
}

export default function CarCard({ car, onReserve, pickupDate, returnDate }: CarCardProps) {
  const { t } = useTranslation()

  const days =
    pickupDate && returnDate
      ? Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))
      : null

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {car.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{car.name}</h3>
            <p className="text-sm text-gray-500">{car.year}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold text-brand-600">
              {car.currency}{car.pricePerDay}
            </p>
            <p className="text-xs text-gray-400">{t('cars.perDay')}</p>
            {days && (
              <p className="text-xs text-brand-600 font-medium mt-0.5">
                {car.currency}{car.pricePerDay * days} / {days}d
              </p>
            )}
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Spec icon={<Calendar className="w-3.5 h-3.5" />} label={t('cars.year')} value={String(car.year)} />
          <Spec icon={<DoorOpen className="w-3.5 h-3.5" />} label={t('cars.doors')} value={String(car.doors)} />
          <Spec icon={<Users className="w-3.5 h-3.5" />} label={t('cars.seats')} value={String(car.seats)} />
          <Spec icon={<Zap className="w-3.5 h-3.5" />} label={t('cars.hp')} value={`${car.hp} ${t('cars.hp')}`} />
          <Spec icon={<Settings className="w-3.5 h-3.5" />} label={t('cars.transmission')} value={t(`common.${car.transmission.toLowerCase()}`)} />
          <Spec icon={<Fuel className="w-3.5 h-3.5" />} label={t('cars.fuel')} value={t(`common.${car.fuel.toLowerCase()}`)} />
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {car.features.slice(0, 4).map((f) => (
            <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
          {car.features.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              +{car.features.length - 4}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onReserve(car)}
          className="btn-primary w-full justify-center mt-auto"
        >
          {t('cars.reserve')}
        </button>
      </div>
    </div>
  )
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 text-center">
      <span className="text-brand-500 mb-0.5">{icon}</span>
      <span className="text-xs text-gray-400 leading-none">{label}</span>
      <span className="text-xs font-semibold text-gray-700 mt-0.5 leading-tight">{value}</span>
    </div>
  )
}
