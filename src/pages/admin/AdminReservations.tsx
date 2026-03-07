import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getReservations, updateReservationStatus } from '../../utils/storage'
import type { Reservation } from '../../utils/storage'
import { sendStatusUpdateEmail } from '../../utils/email'

type Filter = 'all' | 'new' | 'confirmed' | 'cancelled'

export default function AdminReservations() {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    getReservations().then(setReservations)
  }, [])

  useEffect(() => {
    if (!successMsg) return
    const timer = setTimeout(() => setSuccessMsg(''), 4000)
    return () => clearTimeout(timer)
  }, [successMsg])

  async function changeStatus(id: string, status: Reservation['status']) {
    await updateReservationStatus(id, status)
    const reservation = reservations.find((r) => r.id === id)
    if (reservation) {
      const statusLabel =
        status === 'confirmed' ? t('admin.statusConfirmed')
          : status === 'cancelled' ? t('admin.statusCancelled')
            : t('admin.statusNew')
      sendStatusUpdateEmail({
        customerName: `${reservation.firstName} ${reservation.lastName}`,
        customerEmail: reservation.email,
        carName: reservation.vehicleName ?? '',
        pickupDate: reservation.pickupDate,
        returnDate: reservation.returnDate,
        newStatus: statusLabel,
      })
    }
    const updated = await getReservations()
    setReservations(updated)
    setSuccessMsg(t('admin.statusUpdated'))
  }

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter)
  const newCount = reservations.filter((r) => r.status === 'new').length

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: t('admin.filterAll') },
    { key: 'new', label: t('admin.statusNew'), count: newCount || undefined },
    { key: 'confirmed', label: t('admin.statusConfirmed') },
    { key: 'cancelled', label: t('admin.statusCancelled') },
  ]

  function statusBadge(status: Reservation['status']) {
    const cls =
      status === 'new'
        ? 'bg-yellow-100 text-yellow-700'
        : status === 'confirmed'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
    const label =
      status === 'new'
        ? t('admin.statusNew')
        : status === 'confirmed'
          ? t('admin.statusConfirmed')
          : t('admin.statusCancelled')
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
        {label}
      </span>
    )
  }

  return (
    <div className="p-6">
      {successMsg && (
        <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-4 py-3 rounded-lg">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="ml-4 text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">{t('admin.reservations')}</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === f.key
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
            {f.count != null && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-20">{t('admin.noReservations')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.customer')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.email')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.phone')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.vehicle')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.pickupDate')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.returnDate')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.status')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.createdAt')}</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.firstName} {r.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.email}</td>
                  <td className="px-4 py-3 text-gray-600">{r.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{r.vehicleName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.pickupDate}</td>
                  <td className="px-4 py-3 text-gray-600">{r.returnDate}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      {r.status !== 'confirmed' && (
                        <button
                          onClick={() => changeStatus(r.id, 'confirmed')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          {t('admin.confirm')}
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => changeStatus(r.id, 'cancelled')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          {t('admin.cancel')}
                        </button>
                      )}
                      {(r.status === 'confirmed' || r.status === 'cancelled') && (
                        <button
                          onClick={() => changeStatus(r.id, 'new')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                        >
                          {t('admin.reopen')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
