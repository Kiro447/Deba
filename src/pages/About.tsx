import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Eye, Award, Heart } from 'lucide-react'

export default function About() {
  const { t } = useTranslation()

  const values = [
    { icon: <Eye className="w-7 h-7" />, titleKey: 'about.value1Title', descKey: 'about.value1Desc' },
    { icon: <Award className="w-7 h-7" />, titleKey: 'about.value2Title', descKey: 'about.value2Desc' },
    { icon: <Heart className="w-7 h-7" />, titleKey: 'about.value3Title', descKey: 'about.value3Desc' },
  ]

  return (
    <main className="pt-16 min-h-screen">
      <Helmet>
        <title>{t('seo.aboutTitle', 'About Us – Deba Car Rental')}</title>
        <meta name="description" content={t('seo.aboutDesc', 'Learn about Deba Car Rental – your trusted car hire partner in Skopje, North Macedonia.')} />
      </Helmet>
      {/* Hero */}
      <section
        className="relative py-28 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/65" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-4">{t('about.heroTitle')}</h1>
          <p className="text-lg text-gray-200 leading-relaxed">{t('about.heroText')}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-5">{t('about.storyTitle')}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{t('about.storyText')}</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop"
                alt="Our office"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            {t('about.valuesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon, titleKey, descKey }) => (
              <div key={titleKey} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-100 text-brand-600 rounded-xl mb-4">
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(titleKey)}</h3>
                <p className="text-gray-500 leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
