import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { getSession, login as authLogin, logout as authLogout } from '../utils/auth'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(getSession)

  async function login(username: string, password: string): Promise<boolean> {
    const ok = await authLogin(username, password)
    if (ok) setIsAuthenticated(true)
    return ok
  }

  function logout() {
    authLogout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
