import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { uploadSong } from '../services/musicApi'

const isAudioFile = (file) => file && file.type.startsWith('audio/')

export default function UploadSongPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [songTitle, setSongTitle] = useState('')
  const [songFile, setSongFile] = useState(null)
  const [songImage, setSongImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isArtist = user?.role === 'artist'

  const handleSongUpload = async (e) => {
    e.preventDefault()
    if (!songTitle.trim()) {
      setError('Enter song title')
      setSuccess('')
      return
    }
    if (!songFile) {
      setError('Select a song file')
      setSuccess('')
      return
    }
    if (!isAudioFile(songFile)) {
      setError('Please select a valid audio file')
      setSuccess('')
      return
    }
    if (songImage && !songImage.type.startsWith('image/')) {
      setError('Please select a valid cover image')
      setSuccess('')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', songTitle)
    formData.append('music', songFile)
    if (songImage) formData.append('image', songImage)

    try {
      await uploadSong(formData)
      setSuccess('Song uploaded successfully')
      setSongTitle('')
      setSongFile(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Song upload failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isArtist) {
    return (
      <div className="page-wrapper">
        <h2>Upload Song</h2>
        <p>Only artists can upload songs.</p>
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
      <h2>Upload Song</h2>
      <p>Upload a new track to your artist profile.</p>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSongUpload} className="artist-form">
        <label>
          Song Title
          <input value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
        </label>
        <label>
          Song File
          <input type="file" accept="audio/*" onChange={(e) => setSongFile(e.target.files?.[0] || null)} />
        </label>
        <label>
          Cover Image (optional)
          <input type="file" accept="image/*" onChange={(e) => setSongImage(e.target.files?.[0] || null)} />
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
          <button type="button" className="button secondary" onClick={() => navigate('/artist')}>
            Back to Artist Dashboard
          </button>
        </div>
      </form>
    </div>
  )
}
