import { useState, useEffect } from 'react'

const API_BASE = 'http://127.0.0.1:8000/api/v1'

export default function App() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users/`)
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const addUser = async () => {
    await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, surname, username, role })
    })
    setName('')
    setSurname('')
    setUsername('')
    setRole('')
    fetchUsers()
  }

  const deleteUser = async (id) => {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Форма */}
      <div className="mb-8 flex gap-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="border border-gray-300 p-3 rounded w-64"
        />
        <input
          value={surname}
          onChange={e => setSurname(e.target.value)}
          placeholder="Surname"
          className="border border-gray-300 p-3 rounded w-64"
        />
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-gray-300 p-3 rounded w-64"
        />
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="Role"
          className="border border-gray-300 p-3 rounded w-64"
        />
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
        >
          Добавить
        </button>
      </div>

      {/* Таблица */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3">ID</th>
            <th className="border border-gray-300 p-3">Name</th>
            <th className="border border-gray-300 p-3">Surname</th>
            <th className="border border-gray-300 p-3">Username</th>
            <th className="border border-gray-300 p-3">Role</th>
            <th className="border border-gray-300 p-3">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-3">{user.id}</td>
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.surname}</td>
              <td className="border border-gray-300 p-3">{user.username}</td>
              <td className="border border-gray-300 p-3">{user.role}</td>
              <td className="border border-gray-300 p-3">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
