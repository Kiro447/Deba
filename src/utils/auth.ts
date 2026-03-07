import { api, getToken, setToken, removeToken } from './api'

const USE_BACKEND = !!import.meta.env.VITE_API_URL

/* ── Supabase mode constants ── */
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD_HASH = 'e6383afbe8a7c6c7415b9495b6aa8bcb4fa3e8f231aa3de5d192fecbdc6a4299'
const SESSION_KEY = 'deba_auth_session'

async function hashPassword(plain: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function login(username: string, password: string): Promise<boolean> {
  if (USE_BACKEND) {
    try {
      const res = await api.post<{ token: string; success: boolean }>('/api/auth/login', {
        username,
        password,
      })
      if (res.success && res.token) {
        setToken(res.token)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Supabase mode — client-side auth
  if (username !== ADMIN_USERNAME) return false
  const hash = await hashPassword(password)
  if (hash !== ADMIN_PASSWORD_HASH) return false
  localStorage.setItem(SESSION_KEY, '1')
  return true
}

export function logout(): void {
  if (USE_BACKEND) {
    removeToken()
    return
  }
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): boolean {
  if (USE_BACKEND) return !!getToken()
  return localStorage.getItem(SESSION_KEY) === '1'
}
