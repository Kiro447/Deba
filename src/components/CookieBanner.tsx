import { useState } from 'react'
import { loadGA } from '../utils/analytics'

const CONSENT_KEY = 'deba_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY))

  if (!visible) return null

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    loadGA()
    setVisible(false)
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="text-sm text-gray-600">
          We use cookies to understand how visitors use our site and to improve your experience.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
