import { useState } from 'react'
import { useApi } from '../context/ApiContext'

function Settings({ user }) {
  const { apiUrl, saveApiUrl } = useApi()
  const [url, setUrl] = useState(apiUrl)
  const [showUrlForm, setShowUrlForm] = useState(false)

  const handleSaveUrl = () => {
    saveApiUrl(url)
    setShowUrlForm(false)
  }

  return (
    <div className="tab-content active">
      <h2>Настройки</h2>
      
      <div className="settings-group" style={{ marginTop: '16px' }}>
        <div className="setting-item">
          <span>Пользователь</span>
          <span>
            {user?.username || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '-'}
          </span>
        </div>
        <div className="setting-item">
          <span>Telegram ID</span>
          <span>{user?.telegramId || '-'}</span>
        </div>
        <div className="setting-item">
          <span>Роль</span>
          <span>{user?.role || '-'}</span>
        </div>
      </div>

      <button 
        className="btn btn-secondary" 
        onClick={() => setShowUrlForm(!showUrlForm)}
        style={{ width: '100%' }}
      >
        Настройка сервера
      </button>

      {showUrlForm && (
        <div style={{ marginTop: '16px', background: 'white', padding: '16px', borderRadius: '12px' }}>
          <div className="form-group">
            <label>URL сервера API</label>
            <input
              type="text"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:3000"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSaveUrl}>
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
