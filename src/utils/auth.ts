const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD_HASH = 'e6383afbe8a7c6c7415b9495b6aa8bcb4fa3e8f231aa3de5d192fecbdc6a4299'
const SESSION_KEY = 'deba_auth_session'

export async function hashPassword(plain: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function login(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false
  const hash = await hashPassword(password)
  if (hash !== ADMIN_PASSWORD_HASH) return false
  localStorage.setItem(SESSION_KEY, '1')
  return true
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): boolean {
  return localStorage.getItem(SESSION_KEY) === '1'
}
