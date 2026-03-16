import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Auth() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await login()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <h1>🏠 SmartHome</h1>
        <p>Управление умным домом</p>
        
        {error && (
          <div style={{ 
            background: 'rgba(220, 53, 69, 0.9)', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти через Telegram'}
        </button>
      </div>
    </div>
  )
}

export default Auth
