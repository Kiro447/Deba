const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function loadGA() {
  if (!GA_ID || document.getElementById('ga-script')) return
  const script = document.createElement('script')
  script.id = 'ga-script'
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)
  ;(window as any).dataLayer = (window as any).dataLayer || []
  function gtag(...args: any[]) { (window as any).dataLayer.push(args) }
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}
