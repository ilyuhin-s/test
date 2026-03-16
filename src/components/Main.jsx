import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../context/ApiContext'
import Rooms from './Rooms'
import Devices from './Devices'
import Settings from './Settings'

function Main() {
  const { user, logout } = useAuth()
  const { api } = useApi()
  const [activeTab, setActiveTab] = useState('rooms')
  const [rooms, setRooms] = useState([])
  const [devices, setDevices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [roomsData, devicesData] = await Promise.all([
        api.getRooms(),
        api.getDevices()
      ])
      setRooms(roomsData)
      setDevices(devicesData)
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDevice = async (deviceId, isActive) => {
    try {
      await api.updateDeviceState(deviceId, { isActive })
      setDevices(devices.map(d => 
        d.id === deviceId ? { ...d, isActive } : d
      ))
    } catch (err) {
      console.error('Error toggling device:', err)
    }
  }

  const handleAddRoom = async (name, description) => {
    try {
      await api.createRoom({ name, description })
      await loadData()
    } catch (err) {
      console.error('Error adding room:', err)
    }
  }

  const handleUpdateRoom = async (id, name, description) => {
    try {
      await api.updateRoom(id, { name, description })
      await loadData()
    } catch (err) {
      console.error('Error updating room:', err)
    }
  }

  const handleDeleteRoom = async (id) => {
    try {
      await api.deleteRoom(id)
      await loadData()
    } catch (err) {
      console.error('Error deleting room:', err)
    }
  }

  const handleAddDevice = async (name, type, roomId, description) => {
    try {
      const data = { name, type, description }
      if (roomId) data.roomId = roomId
      await api.createDevice(data)
      await loadData()
    } catch (err) {
      console.error('Error adding device:', err)
    }
  }

  const handleUpdateDevice = async (id, name, description) => {
    try {
      await api.updateDevice(id, { name, description })
      await loadData()
    } catch (err) {
      console.error('Error updating device:', err)
    }
  }

  const handleDeleteDevice = async (id) => {
    try {
      await api.deleteDevice(id)
      await loadData()
    } catch (err) {
      console.error('Error deleting device:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="main-screen">
      <header className="header">
        <h1>🏠 SmartHome</h1>
        <button className="btn-icon" onClick={logout} title="Выйти">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </header>

      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Комнаты
        </button>
        <button 
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          Устройства
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Настройки
        </button>
      </nav>

      <main className="content">
        {activeTab === 'rooms' && (
          <Rooms 
            rooms={rooms}
            onAdd={handleAddRoom}
            onUpdate={handleUpdateRoom}
            onDelete={handleDeleteRoom}
          />
        )}
        {activeTab === 'devices' && (
          <Devices 
            devices={devices}
            rooms={rooms}
            onAdd={handleAddDevice}
            onUpdate={handleUpdateDevice}
            onDelete={handleDeleteDevice}
            onToggle={handleToggleDevice}
          />
        )}
        {activeTab === 'settings' && (
          <Settings user={user} />
        )}
      </main>
    </div>
  )
}

export default Main
