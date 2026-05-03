import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAlbumById } from '../services/musicApi'
import SongCard from '../components/SongCard'
import MusicPlayer from '../components/MusicPlayer'

export default function AlbumDetailsPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let canceled = false
    setLoading(true)
    getAlbumById(albumId)
      .then((res) => {
        if (!canceled) {
          setAlbum(res.data.album)
          setError('')
        }
      })
      .catch((err) => {
        if (!canceled) setError(err.message || 'Unable to load album details')
      })
      .finally(() => {
        if (!canceled) setLoading(false)
      })

    return () => {
      canceled = true
    }
  }, [albumId])

  const handlePlay = (song) => {
    if (currentSong?._id === song._id && isPlaying) {
      setIsPlaying(false)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const closePlayer = () => {
    setCurrentSong(null)
    setIsPlaying(false)
  }

  if (loading) return <div className="page-wrapper"><p>Loading album details...</p></div>
  if (error) return <div className="page-wrapper"><p className="error">{error}</p></div>
  if (!album) return <div className="page-wrapper"><p>Album not found.</p></div>

  const firstSongImage = album.musics?.[0]?.image
  const albumCover = firstSongImage || 'https://picsum.photos/seed/album-default/300/300'

  return (
    <div className="page-wrapper">
      <button className="button secondary" onClick={() => navigate('/albums')}>Back to Albums</button>

      <header style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '180px' }}>
          <img src={albumCover} alt={album.title} style={{ width: '180px', height: '180px', borderRadius: '12px', objectFit: 'cover' }} />
        </div>
        <div>
          <p style={{ margin: 0, color: '#7da5d7', fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Album</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem' }}>{album.title}</h1>
          <p style={{ margin: '0.75rem 0 0', color: 'var(--text-secondary)', fontSize: '1rem' }}>Artist: {album.artist?.username || album.artist?.email || 'Unknown'}</p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{album.musics?.length || 0} track{album.musics?.length !== 1 ? 's' : ''}</p>
        </div>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Tracks</h2>
        <div className="card-grid">
          {album.musics && album.musics.length > 0 ? (
            album.musics.map((song) => (
              <SongCard
                key={song._id || song.id}
                song={song}
                onPlay={handlePlay}
                isPlaying={currentSong?._id === song._id && isPlaying}
              />
            ))
          ) : (
            <p>No songs in this album yet.</p>
          )}
        </div>
      </section>

      <MusicPlayer song={currentSong} onClose={closePlayer} />
    </div>
  )
}
