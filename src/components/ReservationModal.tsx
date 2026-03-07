import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { X, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Car } from '../data/cars'
import { createReservation } from '../utils/storage'
import { sendReservationEmail } from '../utils/email'

const USE_BACKEND = !!import.meta.env.VITE_API_URL

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
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
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

  // Auto-close after success
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [success, onClose])

  const set = (field: keyof FormState) => (val: string | Date | null) =>
    setForm((prev) => ({ ...prev, [field]: val }))

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

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const pickupStr = format(form.pickupDate!, 'yyyy-MM-dd')
      const returnStr = format(form.returnDate!, 'yyyy-MM-dd')
      await createReservation({
        vehicleId: car.id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        pickupDate: pickupStr,
        returnDate: returnStr,
        notes: form.notes,
      })
      if (!USE_BACKEND) {
        sendReservationEmail({
          customerName: `${form.firstName} ${form.lastName}`,
          customerEmail: form.email,
          phone: form.phone,
          carName: car.name,
          pickupDate: pickupStr,
          returnDate: returnStr,
          notes: form.notes,
        })
      }
      setSuccess(true)
    } catch {
      setError(t('reservation.errorGeneric'))
    } finally {
      setSubmitting(false)
    }
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

        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('reservation.successTitle')}</h3>
            <p className="text-sm text-gray-500">{t('reservation.successMessage')}</p>
          </div>
        ) : (
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

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              {submitting ? t('reservation.submitting') : t('reservation.submit')}
            </button>
          </div>
        )}
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
