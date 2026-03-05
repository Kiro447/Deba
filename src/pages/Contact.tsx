import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { BUSINESS } from '../data/config'

export default function Contact() {
  const { t } = useTranslation()

  const contactItems = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: t('contact.phoneLabel'),
      value: BUSINESS.phone,
      href: `tel:${BUSINESS.phone}`,
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: t('contact.whatsappLabel'),
      value: `+${BUSINESS.whatsapp}`,
      href: `https://wa.me/${BUSINESS.whatsapp}`,
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: t('contact.emailLabel'),
      value: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: t('contact.addressLabel'),
      value: BUSINESS.address,
      href: undefined,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: t('contact.hoursLabel'),
      value: t('contact.hours'),
      href: undefined,
    },
  ]

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{t('contact.pageTitle')}</h1>
          <p className="text-gray-500 max-w-xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            {contactItems.map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="text-gray-900 font-medium hover:text-brand-600 transition-colors whitespace-pre-line"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium whitespace-pre-line">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="flex flex-col gap-4">
            <a
              href={`https://wa.me/${BUSINESS.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl p-6 transition-colors"
            >
              <MessageCircle className="w-8 h-8 shrink-0" />
              <div>
                <p className="text-lg font-bold">{t('contact.ctaWhatsApp')}</p>
                <p className="text-green-100 text-sm">+{BUSINESS.whatsapp}</p>
              </div>
            </a>

            <a
              href={`mailto:${BUSINESS.email}`}
              className="flex items-center gap-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl p-6 transition-colors"
            >
              <Mail className="w-8 h-8 shrink-0" />
              <div>
                <p className="text-lg font-bold">{t('contact.ctaEmail')}</p>
                <p className="text-brand-200 text-sm">{BUSINESS.email}</p>
              </div>
            </a>

            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-brand-400 text-gray-900 font-semibold rounded-2xl p-6 transition-colors"
            >
              <Phone className="w-8 h-8 shrink-0 text-brand-600" />
              <div>
                <p className="text-lg font-bold">{t('contact.ctaCall')}</p>
                <p className="text-gray-500 text-sm">{BUSINESS.phone}</p>
              </div>
            </a>

            {/* Optional: Google Maps embed */}
            {BUSINESS.googleMapsUrl && (
              <div className="rounded-2xl overflow-hidden flex-1 min-h-[200px] bg-gray-200">
                <iframe
                  src={BUSINESS.googleMapsUrl}
                  className="w-full h-full min-h-[200px]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
