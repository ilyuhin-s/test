import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Main from './components/Main'
import Loading from './components/Loading'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ApiProvider } from './context/ApiContext'
import './App.css'

function AppContent() {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  if (isLoading) {
    return <Loading />
  }
  
  if (!isAuthenticated) {
    return <Auth />
  }
  
  return <Main />
}

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApiProvider>
  )
}

export default App
