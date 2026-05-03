import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { uploadAlbum } from '../services/musicApi'

export default function UploadAlbumPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [albumTitle, setAlbumTitle] = useState('')
  const [albumSongIds, setAlbumSongIds] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isArtist = user?.role === 'artist'

  const handleAlbumUpload = async (e) => {
    e.preventDefault()
    if (!albumTitle.trim()) {
      setError('Enter album title')
      setSuccess('')
      return
    }

    const selectedIds = albumSongIds
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (selectedIds.length === 0) {
      setError('Enter at least one song ID for the album')
      setSuccess('')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await uploadAlbum({ title: albumTitle, musics: selectedIds })
      setSuccess('Album created successfully')
      setAlbumTitle('')
      setAlbumSongIds('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Album upload failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isArtist) {
    return (
      <div className="page-wrapper">
        <h2>Upload Album</h2>
        <p>Only artists can create albums.</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="button" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
          <button className="button secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <h2>Upload Album</h2>
      <p>Create a new album with your uploaded songs.</p>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleAlbumUpload} className="artist-form">
        <label>
          Album Title
          <input value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} />
        </label>
        <label>
          Song IDs (comma-separated)
          <input value={albumSongIds} onChange={(e) => setAlbumSongIds(e.target.value)} placeholder="songId1, songId2" />
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Album'}
          </button>
          <button type="button" className="button secondary" onClick={() => navigate('/artist')}>
            Back to Artist Dashboard
          </button>
        </div>
      </form>
    </div>
  )
}
