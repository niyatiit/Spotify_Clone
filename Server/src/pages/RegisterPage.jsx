import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Register from '../components/Auth/Register'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return

    if (user?.role === 'artist') {
      navigate('/artist', { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  return (
    <main className="App">
      <header className="App-header">
        <h1>Create your account</h1>
      </header>
      <Register />
    </main>
  )
}
