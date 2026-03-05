import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { X, MessageCircle, Mail, Phone, AlertCircle } from 'lucide-react'
import type { Car } from '../data/cars'
import { BUSINESS } from '../data/config'

interface Props {
  car: Car
  initialPickup?: Date | null
  initialReturn?: Date | null
  onClose: () => void
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupDate: Date | null
  returnDate: Date | null
  notes: string
}

export default function ReservationModal({ car, initialPickup, initialReturn, onClose }: Props) {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupDate: initialPickup ?? null,
    returnDate: initialReturn ?? null,
    notes: '',
  })

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const set = (field: keyof FormState) => (val: string | Date | null) =>
    setForm((prev) => ({ ...prev, [field]: val }))

  const buildMessage = () => {
    const pickup = form.pickupDate ? format(form.pickupDate, 'dd/MM/yyyy') : '—'
    const ret = form.returnDate ? format(form.returnDate, 'dd/MM/yyyy') : '—'
    return (
      `Hi, I would like to reserve the ${car.name} (${car.year}).\n\n` +
      `Name: ${form.firstName} ${form.lastName}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Pick-up: ${pickup}\n` +
      `Return: ${ret}\n` +
      (form.notes ? `\nNotes: ${form.notes}` : '')
    )
  }

  const validate = (): boolean => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.pickupDate || !form.returnDate) {
      setError(t('reservation.requiredFields'))
      return false
    }
    if (form.returnDate <= form.pickupDate) {
      setError(t('reservation.dateError'))
      return false
    }
    setError('')
    return true
  }

  const handleWhatsApp = () => {
    if (!validate()) return
    const msg = encodeURIComponent(buildMessage())
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${msg}`, '_blank')
  }

  const handleEmail = () => {
    if (!validate()) return
    const subject = encodeURIComponent(`Car Reservation – ${car.name}`)
    const body = encodeURIComponent(buildMessage())
    window.open(`mailto:${BUSINESS.email}?subject=${subject}&body=${body}`)
  }

  const handleCall = () => {
    window.open(`tel:${BUSINESS.phone}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('reservation.title')}: {car.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{t('reservation.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t('reservation.firstName')}
              value={form.firstName}
              onChange={(v) => set('firstName')(v)}
              placeholder="John"
              required
            />
            <InputField
              label={t('reservation.lastName')}
              value={form.lastName}
              onChange={(v) => set('lastName')(v)}
              placeholder="Doe"
              required
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t('reservation.email')}
              value={form.email}
              onChange={(v) => set('email')(v)}
              placeholder="john@example.com"
              type="email"
              required
            />
            <InputField
              label={t('reservation.phone')}
              value={form.phone}
              onChange={(v) => set('phone')(v)}
              placeholder="+389 70 000 000"
              type="tel"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reservation.pickupDate')} <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <DatePicker
                  selected={form.pickupDate}
                  onChange={(d) => set('pickupDate')(d)}
                  selectsStart
                  startDate={form.pickupDate ?? undefined}
                  endDate={form.returnDate ?? undefined}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reservation.returnDate')} <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <DatePicker
                  selected={form.returnDate}
                  onChange={(d) => set('returnDate')(d)}
                  selectsEnd
                  startDate={form.pickupDate ?? undefined}
                  endDate={form.returnDate ?? undefined}
                  minDate={form.pickupDate ?? new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('reservation.notes')}
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes')(e.target.value)}
              placeholder={t('reservation.notesPlaceholder')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-400 uppercase tracking-wider">
                {t('reservation.orDivider')}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              {t('reservation.sendWhatsApp')}
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              {t('reservation.sendEmail')}
            </button>

            <button
              onClick={handleCall}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 hover:border-brand-500 hover:text-brand-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              <Phone className="w-5 h-5" />
              {t('reservation.callUs')} — {BUSINESS.phone}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
    </div>
  )
}
