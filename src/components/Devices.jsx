import { useState } from 'react'

const deviceIcons = {
  light: '💡',
  switch: '🔌',
  sensor: '📡',
  thermostat: '🌡️',
  camera: '📷',
  lock: '🔒',
  outlet: '🔋',
  blinds: '🪟',
  fan: '🌀',
  other: '📦'
}

const deviceTypes = [
  { value: 'light', label: '💡 Свет' },
  { value: 'switch', label: '🔌 Выключатель' },
  { value: 'sensor', label: '📡 Датчик' },
  { value: 'thermostat', label: '🌡️ Термостат' },
  { value: 'camera', label: '📷 Камера' },
  { value: 'lock', label: '🔒 Замок' },
  { value: 'outlet', label: '🔋 Розетка' },
  { value: 'blinds', label: '🪟 Жалюзи' },
  { value: 'fan', label: '🌀 Вентилятор' },
  { value: 'other', label: '📦 Другое' }
]

function Devices({ devices, rooms, onAdd, onUpdate, onDelete, onToggle }) {
  const [showForm, setShowForm] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('light')
  const [roomId, setRoomId] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDevice) {
      onUpdate(editingDevice.id, name, description)
    } else {
      onAdd(name, type, roomId || null, description)
    }
    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingDevice(null)
    setName('')
    setType('light')
    setRoomId('')
    setDescription('')
  }

  const handleEdit = (device) => {
    setEditingDevice(device)
    setName(device.name)
    setType(device.type)
    setRoomId(device.roomId || '')
    setDescription(device.description || '')
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить устройство?')) {
      onDelete(id)
    }
  }

  const handleToggle = (e, deviceId) => {
    e.stopPropagation()
    const device = devices.find(d => d.id === deviceId)
    if (device) {
      onToggle(deviceId, !device.isActive)
    }
  }

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2>Устройства</h2>
        <button className="btn btn-small" onClick={() => setShowForm(true)}>
          + Добавить
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px', background: 'white', padding: '16px', borderRadius: '12px' }}>
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Люстра"
              required
            />
          </div>
          <div className="form-group">
            <label>Тип</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {deviceTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Комната</label>
            <select
              className="form-control"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              <option value="">Без комнаты</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Описание</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание устройства"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDevice ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      )}

      {devices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💡</div>
          <h3>Нет устройств</h3>
          <p>Добавьте первое устройство</p>
        </div>
      ) : (
        <div className="cards-list">
          {devices.map(device => (
            <div key={device.id} className="card device-card" onClick={() => handleEdit(device)}>
              <div className={`device-status ${device.status || 'offline'}`}></div>
              <div className="card-icon">{deviceIcons[device.type] || '📦'}</div>
              <div className="card-title">{device.name}</div>
              <div className="card-subtitle">{device.type}</div>
              <div className="device-toggle">
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={device.isActive || false} 
                    onChange={(e) => handleToggle(e, device.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Devices
