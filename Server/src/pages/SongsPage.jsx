import { useEffect, useState } from 'react'
import { getAllSongs, getArtistSongs } from '../services/musicApi'
import { useAuth } from '../context/AuthContext'
import SongCard from '../components/SongCard'
import MusicPlayer from '../components/MusicPlayer'

export default function SongsPage() {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const isArtist = user?.role === 'artist'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    
    const fetchSongs = isArtist ? getArtistSongs() : getAllSongs()
    
    fetchSongs
      .then((res) => {
        if (!cancelled) {
          setSongs(res.data.musics || [])
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Unable to load songs')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isArtist])

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

  return (
    <div className="page-wrapper">
      <h2>{isArtist ? 'My Songs' : 'Songs'}</h2>
      <p>{isArtist ? 'View and manage all songs you have uploaded.' : 'Explore all songs and click play to open the player.'}</p>

      {loading && <p>Loading songs...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="card-grid">
          {songs.length > 0 ? (
            songs.map((song) => (
              <SongCard 
                key={song._id || song.id} 
                song={song} 
                onPlay={handlePlay}
                isPlaying={currentSong?._id === song._id && isPlaying}
              />
            ))
          ) : (
            <p>{isArtist ? 'No songs uploaded yet.' : 'No songs found.'}</p>
          )}
        </div>
      )}

      <MusicPlayer song={currentSong} onClose={closePlayer} />
    </div>
  )
}
