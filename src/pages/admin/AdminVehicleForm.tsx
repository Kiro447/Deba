import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, Loader2, X, Star } from 'lucide-react'
import { getVehicles, addVehicle, updateVehicle } from '../../utils/storage'
import type { Car, Category, Transmission, Fuel } from '../../data/cars'
import { useTranslation } from 'react-i18next'

const CATEGORIES: Category[] = ['Economy', 'Compact', 'SUV', 'Luxury', 'Van']
const TRANSMISSIONS: Transmission[] = ['Manual', 'Automatic']
const FUELS: Fuel[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid']

function emptyForm() {
  return {
    name: '',
    category: 'Compact' as Category,
    year: new Date().getFullYear(),
    doors: 4,
    seats: 5,
    transmission: 'Manual' as Transmission,
    fuel: 'Petrol' as Fuel,
    hp: 100,
    pricePerDay: 30,
    currency: '€',
    image: '',
    images: [] as string[],
    features: '',
    available: true,
  }
}

export default function AdminVehicleForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setError('')
    if (!id) {
      setForm(emptyForm())
      return
    }
    getVehicles().then((vehicles) => {
      const existing = vehicles.find((c) => c.id === id)
      if (existing) {
        setForm({
          name: existing.name,
          category: existing.category,
          year: existing.year,
          doors: existing.doors,
          seats: existing.seats,
          transmission: existing.transmission,
          fuel: existing.fuel,
          hp: existing.hp,
          pricePerDay: existing.pricePerDay,
          currency: existing.currency,
          image: existing.image,
          images: existing.images ?? [],
          features: existing.features.join(', '),
          available: existing.available,
        })
      }
    })
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function uploadToCloudinary(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd }
    )
    const data = await res.json()
    return data.secure_url ?? null
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')

    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      const url = await uploadToCloudinary(file)
      if (url) newUrls.push(url)
    }

    if (newUrls.length === 0) {
      setError('Image upload failed.')
    } else {
      setForm((prev) => {
        const updatedImages = [...prev.images, ...newUrls]
        return {
          ...prev,
          images: updatedImages,
          image: prev.image || updatedImages[0],
        }
      })
    }
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(index: number) {
    setForm((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index)
      const removedUrl = prev.images[index]
      return {
        ...prev,
        images: updatedImages,
        image: prev.image === removedUrl ? (updatedImages[0] ?? '') : prev.image,
      }
    })
  }

  function setPrimaryImage(url: string) {
    setForm((prev) => ({ ...prev, image: url }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) { setError(t('admin.errorName')); return }
    if (!form.image.trim() && form.images.length === 0) { setError(t('admin.errorImage')); return }
    if (form.pricePerDay <= 0) { setError(t('admin.errorPrice')); return }
    if (form.year < 1900 || form.year > 2100) { setError(t('admin.errorYear')); return }

    const primaryImage = form.image.trim() || form.images[0] || ''

    const car: Car = {
      id: isEdit ? id! : crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category,
      year: Number(form.year),
      doors: Number(form.doors),
      seats: Number(form.seats),
      transmission: form.transmission,
      fuel: form.fuel,
      hp: Number(form.hp),
      pricePerDay: Number(form.pricePerDay),
      currency: form.currency.trim() || '€',
      image: primaryImage,
      images: form.images,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      available: form.available,
    }

    setSaving(true)
    if (isEdit) {
      await updateVehicle(car)
    } else {
      await addVehicle(car)
    }
    setSaving(false)

    navigate('/admin', {
      state: { success: isEdit ? t('admin.successUpdated') : t('admin.successAdded') },
    })
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        {isEdit ? t('admin.editVehicle') : t('admin.addVehicle')}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {/* Name */}
        <Field label={t('admin.name')}>
          <input name="name" value={form.name} onChange={handleChange} required
            className={input} placeholder="e.g. Toyota Corolla" />
        </Field>

        {/* Category */}
        <Field label={t('admin.category')}>
          <select name="category" value={form.category} onChange={handleChange} className={input}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>

        {/* Year / Doors / Seats / HP */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('admin.year')}>
            <input name="year" type="number" value={form.year} onChange={handleChange} className={input} />
          </Field>
          <Field label={t('admin.hp')}>
            <input name="hp" type="number" value={form.hp} onChange={handleChange} className={input} />
          </Field>
          <Field label={t('admin.doors')}>
            <input name="doors" type="number" value={form.doors} onChange={handleChange} className={input} />
          </Field>
          <Field label={t('admin.seats')}>
            <input name="seats" type="number" value={form.seats} onChange={handleChange} className={input} />
          </Field>
        </div>

        {/* Transmission / Fuel */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('admin.transmission')}>
            <select name="transmission" value={form.transmission} onChange={handleChange} className={input}>
              {TRANSMISSIONS.map((tr) => <option key={tr}>{tr}</option>)}
            </select>
          </Field>
          <Field label={t('admin.fuel')}>
            <select name="fuel" value={form.fuel} onChange={handleChange} className={input}>
              {FUELS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
        </div>

        {/* Price / Currency */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('admin.pricePerDay')}>
            <input name="pricePerDay" type="number" value={form.pricePerDay} onChange={handleChange} className={input} />
          </Field>
          <Field label={t('admin.currency')}>
            <input name="currency" value={form.currency} onChange={handleChange} className={input} placeholder="€" />
          </Field>
        </div>

        {/* Images */}
        <Field label={t('admin.images', 'Vehicle Images')}>
          <div className="flex gap-2">
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className={input}
              placeholder="https://... (primary image URL)"
            />
            <label className={`shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? t('admin.uploading') : t('admin.uploadImages', 'Upload')}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </Field>

        {/* Image gallery preview */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className={`w-full h-28 object-cover rounded-lg bg-gray-100 ${url === form.image ? 'ring-2 ring-brand-500' : ''}`}
                />
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(url)}
                    className={`p-1 rounded-full shadow-sm transition-colors ${url === form.image ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-brand-50'}`}
                    title={t('admin.setPrimary', 'Set as primary')}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="p-1 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    title={t('admin.removeImage', 'Remove')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {url === form.image && (
                  <span className="absolute bottom-1 left-1 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {t('admin.primary', 'PRIMARY')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Single image preview fallback */}
        {form.image && form.images.length === 0 && (
          <img src={form.image} alt="preview" className="w-full h-40 object-cover rounded-lg bg-gray-100" />
        )}

        {/* Features */}
        <Field label={t('admin.features')}>
          <input name="features" value={form.features} onChange={handleChange} className={input}
            placeholder="AC, Bluetooth, Navigation" />
        </Field>

        {/* Available */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            name="available"
            type="checkbox"
            checked={form.available}
            onChange={handleChange}
            className="w-4 h-4 accent-brand-600"
          />
          <span className="text-sm font-medium text-gray-700">{t('admin.availableForRental')}</span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={uploading || saving}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {isEdit ? t('admin.saveChanges') : t('admin.addVehicle')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {t('admin.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
