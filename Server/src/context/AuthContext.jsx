import api from '../services/api'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spotify_user')) || null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('spotify_token') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsAuthenticated(!!user || !!token)
    if (user) {
      localStorage.setItem('spotify_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('spotify_user')
    }

    if (token) {
      localStorage.setItem('spotify_token', token)
    } else {
      localStorage.removeItem('spotify_token')
    }
  }, [user, token])

  const login = async ({ username, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { username, email, password })
      if (!data.success) {
        throw new Error(data.message || 'Login failed')
      }
      setUser(data.user)
      setToken(data.token || '')
      setIsAuthenticated(true)
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ username, email, password, role = 'user' }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/register', { username, email, password, role })
      if (!data.success) {
        throw new Error(data.message || 'Registration failed')
      }
      if (data.user && data.token) {
        setUser(data.user)
        setToken(data.token)
        setIsAuthenticated(true)
      }
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore if server isn't reachable
    } finally {
      setUser(null)
      setToken('')
      setIsAuthenticated(false)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
