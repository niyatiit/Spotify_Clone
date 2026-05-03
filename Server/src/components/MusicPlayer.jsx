import { useState, useEffect, useRef } from 'react'

export default function MusicPlayer({ song, onClose }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!song || !audioRef.current) return

    if (playing) {
      audioRef.current.play().catch((err) => {
        console.log('Audio play error:', err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [playing, song])

  useEffect(() => {
    setPlaying(false)
  }, [song])

  const togglePlay = () => {
    setPlaying((s) => !s)
  }

  const handleSongEnd = () => {
    setPlaying(false)
  }

  if (!song) {
    return null
  }

  const artistName = song.artist?.username || song.artist?.email || 'Unknown Artist'

  return (
    <footer className="music-player">
      <audio 
        ref={audioRef}
        src={song.uri}
        onEnded={handleSongEnd}
        crossOrigin="anonymous"
      />
      <div className="player-info">
        <strong>Now Playing</strong>
        <p>{song.title} - {artistName}</p>
      </div>
      <div className="player-actions">
        <button className="button small" onClick={togglePlay}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button className="button secondary small" onClick={onClose}>Close</button>
      </div>
    </footer>
  )
}
