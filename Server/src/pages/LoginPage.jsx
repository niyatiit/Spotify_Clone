import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Auth/Login'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <main className="App">
      <header className="App-header">
        <h1>Login to Spotify MERN</h1>
      </header>
      <Login />
    </main>
  )
}
