import { api, getToken, setToken, removeToken } from './api'

export async function login(username: string, password: string): Promise<boolean> {
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

export function logout(): void {
  removeToken()
}

export function getSession(): boolean {
  return !!getToken()
}
