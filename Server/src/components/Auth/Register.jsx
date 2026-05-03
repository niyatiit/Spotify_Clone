import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const validateRegisterForm = ({ username, email, password, role }) => {
  if (!username.trim()) return 'Enter your username'
  if (!email.trim()) return 'Enter your email'
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email address'
  if (!password) return 'Enter your password'
  if (password.length < 6) return 'Password must be at least 6 characters'
  if (!['user', 'artist'].includes(role)) return 'Select a valid role'
  return ''
}

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  })

  const [validationError, setValidationError] = useState('')
  const { register, error, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationMessage = validateRegisterForm(form)

    if (validationMessage) {
      setValidationError(validationMessage)
      return
    }

    setValidationError('')
    await register(form)
  }

  return (
    <section className="max-w-md mx-auto mt-10 bg-zinc-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <label className="flex flex-col text-white">
          Username
          <input
            className="mt-2 p-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
          />
        </label>

        <label className="flex flex-col text-white">
          Email
          <input
            type="email"
            className="mt-2 p-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />
        </label>

        <label className="flex flex-col text-white">
          Password
          <input
            type="password"
            className="mt-2 p-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </label>

        <label className="flex flex-col text-white">
          Role
          <select
            className="mt-2 p-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value }))
            }
          >
            <option value="user">User</option>
            <option value="artist">Artist</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {(validationError || error) && (
        <p className="text-red-500 mt-4 text-center">
          {validationError || error}
        </p>
      )}
    </section>
  )
}