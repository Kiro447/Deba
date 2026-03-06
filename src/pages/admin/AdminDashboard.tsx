import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import { getVehicles, deleteVehicle } from '../../utils/storage'
import type { Car } from '../../data/cars'
import { useTranslation } from 'react-i18next'

export default function AdminDashboard() {
  const location = useLocation()
  const { t } = useTranslation()
  const [vehicles, setVehicles] = useState<Car[]>(() => getVehicles())
  const [successMsg, setSuccessMsg] = useState<string>(() => {
    const msg = (location.state as { success?: string })?.success ?? ''
    if (msg) window.history.replaceState({}, '')
    return msg
  })
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!successMsg) return
    const timer = setTimeout(() => setSuccessMsg(''), 4000)
    return () => clearTimeout(timer)
  }, [successMsg])

  function confirmDelete() {
    if (!pendingDeleteId) return
    deleteVehicle(pendingDeleteId)
    setVehicles(getVehicles())
    setSuccessMsg(t('admin.successDeleted'))
    setPendingDeleteId(null)
  }

  const pendingCar = vehicles.find((v) => v.id === pendingDeleteId)

  return (
    <div className="p-6">
      {/* Delete confirmation modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t('admin.deleteVehicle')}</h2>
            <p className="text-sm text-gray-600 mb-6">
              <span className="font-semibold">{pendingCar?.name}</span> {t('admin.deleteWarning')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                {t('admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-4 py-3 rounded-lg">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="ml-4 text-green-600 hover:text-green-800">✕</button>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">{t('admin.vehicles')}</h1>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          {t('admin.addVehicle')}
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <p className="text-gray-400 text-center py-20">{t('admin.noVehicles')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-16">{t('admin.photo')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.name')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.category')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.year')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.pricePerDay')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('admin.status')}</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-12 h-9 object-cover rounded-md bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{car.name}</td>
                  <td className="px-4 py-3 text-gray-600">{car.category}</td>
                  <td className="px-4 py-3 text-gray-600">{car.year}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {car.currency}{car.pricePerDay}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        car.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {car.available ? t('admin.available') : t('admin.unavailable')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Link
                        to={`/admin/vehicles/${car.id}/edit`}
                        className="p-1.5 rounded-md text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        title={t('admin.editVehicle')}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setPendingDeleteId(car.id)}
                        className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title={t('admin.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
