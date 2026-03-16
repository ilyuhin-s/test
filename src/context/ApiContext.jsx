import { createContext, useContext, useState, useCallback } from 'react'

const ApiContext = createContext(null)

export function ApiProvider({ children }) {
  const [apiUrl, setApiUrl] = useState(() => 
    localStorage.getItem('smarth_api_url') || 'http://localhost:3000'
  )

  const saveApiUrl = useCallback((url) => {
    localStorage.setItem('smarth_api_url', url)
    setApiUrl(url)
  }, [])

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('smarth_token')
    const headers = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }, [])

  const request = useCallback(async (endpoint, options = {}) => {
    const url = `${apiUrl}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }, [apiUrl, getHeaders])

  const api = {
    // Авторизация
    telegramLogin: (initData) => request('/auth/telegram/init', {
      method: 'POST',
      body: JSON.stringify({ initData })
    }),
    verifyToken: () => request('/auth/verify'),

    // Комнаты
    getRooms: () => request('/rooms'),
    getRoom: (id) => request(`/rooms/${id}`),
    createRoom: (data) => request('/rooms', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateRoom: (id, data) => request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

    // Устройства
    getDevices: () => request('/devices'),
    getDevice: (id) => request(`/devices/${id}`),
    createDevice: (data) => request('/devices', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateDevice: (id, data) => request(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    deleteDevice: (id) => request(`/devices/${id}`, { method: 'DELETE' }),
    updateDeviceState: (id, state) => request(`/devices/${id}/state`, {
      method: 'PUT',
      body: JSON.stringify(state)
    }),
  }

  return (
    <ApiContext.Provider value={{ api, apiUrl, saveApiUrl }}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}
