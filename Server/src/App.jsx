import './App.css'
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import AlbumsPage from './pages/AlbumsPage'
import AlbumDetailsPage from './pages/AlbumDetailsPage'
import SongsPage from './pages/SongsPage'
import ArtistDashboard from './pages/ArtistDashboard'
import UploadSongPage from './pages/UploadSongPage'
import UploadAlbumPage from './pages/UploadAlbumPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const showSidebar = isAuthenticated && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">Spotify Project</div>
        <nav className="nav-buttons">
          {isAuthenticated ? (
            <button className="button transparent" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="button link">
                Login
              </Link>
              <Link to="/register" className="button link">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <div className="main-layout">
        {showSidebar && (
          <aside className="sidebar">
            <Link className="side-link" to="/dashboard">
              Dashboard
            </Link>
            {user?.role === 'artist' && (
              <Link className="side-link" to="/albums">
                Albums
              </Link>
            )}
            <Link className="side-link" to="/songs">
              Songs
            </Link>
            {user?.role === 'artist' && (
              <>
                <Link className="side-link" to="/artist">
                  Artist
                </Link>
                <Link className="side-link" to="/upload-song">
                  Upload Song
                </Link>
                <Link className="side-link" to="/upload-album">
                  Upload Album
                </Link>
              </>
            )}
          </aside>
        )}

        <main className={`content ${showSidebar ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to={user?.role === 'artist' ? '/artist' : '/dashboard'} replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to={user?.role === 'artist' ? '/artist' : '/dashboard'} replace />
                ) : (
                  <RegisterPage />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/albums"
              element={
                <ProtectedRoute>
                  {user?.role === 'artist' ? <AlbumsPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/albums/:albumId"
              element={
                <ProtectedRoute>
                  {user?.role === 'artist' ? <AlbumDetailsPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route path="/songs" element={<ProtectedRoute><SongsPage /></ProtectedRoute>} />
            <Route
              path="/artist"
              element={
                <ProtectedRoute>
                  {user?.role === 'artist' ? <ArtistDashboard /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-song"
              element={
                <ProtectedRoute>
                  {user?.role === 'artist' ? <UploadSongPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-album"
              element={
                <ProtectedRoute>
                  {user?.role === 'artist' ? <UploadAlbumPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
