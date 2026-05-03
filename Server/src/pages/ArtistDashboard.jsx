import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getArtistSongs, getArtistAlbums } from '../services/musicApi'
import SongCard from '../components/SongCard'
import AlbumCard from '../components/AlbumCard'

export default function ArtistDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mySongs, setMySongs] = useState([])
  const [myAlbums, setMyAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalAlbums: 0,
    totalTracks: 0,
    totalPlays: 0,
    followers: 0
  })

  const isArtist = user?.role === 'artist'

  useEffect(() => {
    if (!isArtist) return

    setLoading(true)
    Promise.all([getArtistSongs(), getArtistAlbums()])
      .then(([songsRes, albumsRes]) => {
        const songs = songsRes.data.musics || []
        const albums = albumsRes.data.albums || []
        
        setMySongs(songs)
        setMyAlbums(albums)
        
        // Calculate personalized stats
        const totalSongs = songs.length
        const totalAlbums = albums.length
        const totalTracks = songs.length + albums.reduce((sum, album) => sum + (album.musics?.length || 0), 0)
        const totalPlays = songs.reduce((acc, song) => acc + (song.plays || 0), 0) || Math.floor(Math.random() * 10000) + totalSongs * 100
        const followers = Math.floor(Math.random() * 1000) + totalSongs * 10 + totalAlbums * 5 // More personalized mock data
        
        setStats({
          totalSongs,
          totalAlbums,
          totalTracks,
          totalPlays,
          followers
        })
        
        setError('')
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load artist data'))
      .finally(() => setLoading(false))
  }, [isArtist])

  const refresh = () => {
    if (!isArtist) return

    setLoading(true)
    Promise.all([getArtistSongs(), getArtistAlbums()])
      .then(([songsRes, albumsRes]) => {
        const songs = songsRes.data.musics || []
        const albums = albumsRes.data.albums || []
        
        setMySongs(songs)
        setMyAlbums(albums)
        
        // Recalculate personalized stats
        const totalSongs = songs.length
        const totalAlbums = albums.length
        const totalTracks = songs.length + albums.reduce((sum, album) => sum + (album.musics?.length || 0), 0)
        const totalPlays = songs.reduce((acc, song) => acc + (song.plays || 0), 0) || Math.floor(Math.random() * 10000) + totalSongs * 100
        const followers = Math.floor(Math.random() * 1000) + totalSongs * 10 + totalAlbums * 5
        
        setStats({
          totalSongs,
          totalAlbums,
          totalTracks,
          totalPlays,
          followers
        })
        
        setError('')
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to refresh data'))
      .finally(() => setLoading(false))
  }

  const handlePlay = (song) => {
    if (currentSong?._id === song._id && isPlaying) {
      setIsPlaying(false)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  if (!isArtist) {
    return (
      <div className="page-wrapper">
        <h2>Artist Dashboard</h2>
        <p>Only artists can access this page.</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="button" onClick={() => navigate('/songs')}>
            Go to Songs
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
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Artist Dashboard</h2>
          <p>Manage your artist profile, uploaded songs, and albums.</p>
        </div>
        <button className="button secondary" onClick={logout}>
          Logout
        </button>
      </header>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading artist content...</p>}

      <section className="artist-section">
        <h3>Personal Info</h3>
        <div className="artist-profile">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {/* <p><strong>Artist ID:</strong> {user._id?.slice(-8) || 'N/A'}</p> */}
          <p><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
      </section>

      <section className="artist-section">
        <h3>Artist Statistics</h3>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.totalSongs}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Songs Uploaded</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.totalAlbums}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Albums Created</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.totalTracks}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Tracks</p>
          </div>
          
        </div>
      </section>

      <section className="artist-section">
        <h3>Quick Actions</h3>
        <div className="dashboard-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="button hover:text-white" to="/upload-song">
            Upload Song
          </Link>
          <Link className="button hover:text-white" to="/upload-album">
            Upload Album
          </Link>
          <button className="button secondary" onClick={refresh}>
            Refresh Library
          </button>
        </div>
      </section>

      <section className="artist-section">
        <h3>My Songs</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {mySongs.length} song{mySongs.length !== 1 ? 's' : ''} in your library
          </p>
          <Link className="button small" to="/upload-song">
            Add New Song
          </Link>
        </div>
        {mySongs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-card-soft)', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)' }}>No songs uploaded yet</p>
            <Link className="button" to="/upload-song">Upload Your First Song</Link>
          </div>
        ) : (
          <div className="card-grid">
            {mySongs.map((song) => (
              <SongCard
                key={song._id || song.id}
                song={song}
                onPlay={handlePlay}
                isPlaying={currentSong?._id === song._id && isPlaying}
              />
            ))}
          </div>
        )}
      </section>

      <section className="artist-section">
        <h3>My Albums</h3>
        {myAlbums.length === 0 ? <p>No albums yet.</p> : null}
        <div className="card-grid">
          {myAlbums.map((album) => (
            <div key={album._id || album.id} className="card album-card">
              <h4>{album.title}</h4>
              <p>{album.musics?.length || 0} songs</p>
              <button className="button small" onClick={() => navigate(`/albums/${album._id || album.id}`)}>
                View
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

