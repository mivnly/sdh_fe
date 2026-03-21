import { useState, useEffect } from 'react'

const API_BASE = 'http://127.0.0.1:8000/api/v1'

export default function App() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    role: '',
    comment: ''
  })

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users/`)
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId 
      ? `${API_BASE}/users/${editingId}` 
      : `${API_BASE}/users/`

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    setShowModal(false)
    setFormData({ name: '', surname: '', username: '', role: '', comment: ''})
    setEditingId(null)
    fetchUsers()
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      surname: user.surname,
      username: user.username,
      role: user.role,
      comment: user.comment
    })
    setEditingId(user.id)
    setShowModal(true)
  }

  const openAddModal = () => {
    setFormData({ name: '', surname: '', username: '', role: '', comment: '' })
    setEditingId(null)
    setShowModal(true)
  }

  const deleteUser = async (id) => {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Таблица */}
      <table className="w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3">ID</th>
            <th className="border border-gray-300 p-3">Name</th>
            <th className="border border-gray-300 p-3">Surname</th>
            <th className="border border-gray-300 p-3">Username</th>
            <th className="border border-gray-300 p-3">Role</th>
            <th className="border border-gray-300 p-3">Comment</th>
            <th className="border border-gray-300 p-3 w-24">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3">{user.id}</td>
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.surname}</td>
              <td className="border border-gray-300 p-3">{user.username}</td>
              <td className="border border-gray-300 p-3">{user.role}</td>
              <td className="border border-gray-300 p-3">{user.comment}</td>
              <td className="border border-gray-300 p-3">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-700 hover:scale-110 transition-all cursor-pointer p-1 rounded-lg"
                    title="Редактировать"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.493 2.493 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-700 hover:scale-110 transition-all cursor-pointer p-1 rounded-lg"
                    title="Удалить"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.595 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.595-1.858L5 7m5 4v6m4-6v6m1-10V9a1 1 0 00-1 1v1M12 4v6m2-3v3" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Плюсик в нижней части таблицы */}
      <div className="flex justify-center">
        <button
          onClick={openAddModal}
          className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg text-lg font-medium cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Добавить пользователя
        </button>
      </div>

      {/* Модальное окно (поля появляются при клике) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white rounded-3xl p-8 w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6">
              {editingId ? 'Редактировать пользователя' : 'Новый пользователь'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Name"
                  className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
                  required
                />
              </div>
              <div>
                <input
                  value={formData.surname}
                  onChange={e => setFormData({...formData, surname: e.target.value})}
                  placeholder="Surname"
                  className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
                  required
                />
              </div>
              <div>
                <input
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  placeholder="Username"
                  className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
                  required
                />
              </div>
              <div>
                <input
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  placeholder="Role"
                  className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
                  required
                />
              </div>
              <div>
                <input
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                  placeholder="Comment"
                  className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 border border-gray-300 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-[0.985] cursor-pointer transition-all font-medium shadow-md"
                >
                  {editingId ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
