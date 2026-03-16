import { createContext, useContext, useState, useCallback } from 'react'
import { useApi } from './ApiContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smarth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('smarth_token'))
  const [isLoading, setIsLoading] = useState(true)
  const { api } = useApi()

  const initTelegram = useCallback(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp
      tg.expand()
      tg.ready()
      return tg
    }
    return null
  }, [])

  const login = useCallback(async () => {
    const tg = initTelegram()
    
    if (!tg) {
      throw new Error('Telegram WebApp не доступен')
    }

    const initData = tg.initData
    
    if (!initData) {
      throw new Error('Не удалось получить данные авторизации')
    }

    const response = await api.telegramLogin(initData)
    
    localStorage.setItem('smarth_token', response.access_token)
    localStorage.setItem('smarth_user', JSON.stringify(response.user))
    
    setUser(response.user)
    setIsAuthenticated(true)
    
    return response
  }, [api, initTelegram])

  const logout = useCallback(() => {
    localStorage.removeItem('smarth_token')
    localStorage.removeItem('smarth_user')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    const token = localStorage.getItem('smarth_token')
    
    if (!token) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }

    try {
      const result = await api.verifyToken()
      if (result.valid) {
        setIsAuthenticated(true)
      } else {
        logout()
      }
    } catch {
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [api, logout])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth,
      initTelegram
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
