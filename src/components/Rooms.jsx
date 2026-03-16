import { useState } from 'react'

const roomIcons = {
  'гостиная': '🛋️',
  'спальня': '🛏️',
  'кухня': '🍳',
  'ванная': '🚿',
  'туалет': '🚽',
  'прихожая': '🚪',
  'балкон': '🌅',
  'гараж': '🚗',
  'офис': '💼'
}

function getRoomIcon(name) {
  const lowerName = name.toLowerCase()
  return roomIcons[lowerName] || '🏠'
}

function Rooms({ rooms, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingRoom) {
      onUpdate(editingRoom.id, name, description)
    } else {
      onAdd(name, description)
    }
    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingRoom(null)
    setName('')
    setDescription('')
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    setName(room.name)
    setDescription(room.description || '')
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить комнату?')) {
      onDelete(id)
    }
  }

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2>Комнаты</h2>
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
              placeholder="Например: Гостиная"
              required
            />
          </div>
          <div className="form-group">
            <label>Описание</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание комнаты"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRoom ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      )}

      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h3>Нет комнат</h3>
          <p>Добавьте первую комнату</p>
        </div>
      ) : (
        <div className="cards-list">
          {rooms.map(room => (
            <div key={room.id} className="card" onClick={() => handleEdit(room)}>
              <div className="card-icon">{getRoomIcon(room.name)}</div>
              <div className="card-title">{room.name}</div>
              <div className="card-subtitle">{room.description || 'Без описания'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Rooms
