const placeholderImages = [
  'https://picsum.photos/seed/track-1/240/240',
  'https://picsum.photos/seed/track-2/240/240',
  'https://picsum.photos/seed/track-3/240/240',
  'https://picsum.photos/seed/track-4/240/240',
  'https://picsum.photos/seed/track-5/240/240',
]

const getSongPlaceholder = (seedString) => {
  let hash = 0
  for (let i = 0; i < seedString.length; i += 1) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % placeholderImages.length
  return placeholderImages[index]
}

export default function SongCard({ song, onPlay, isPlaying }) {
  const artistName = song.artist?.username || song.artist?.email || song.artist || 'Unknown Artist'
  const seed = song._id || song.id || `${song.title}-${artistName}`
  const thumb = song.image || getSongPlaceholder(seed)

  return (
    <article className="card song-card">
      <img className="song-image" src={thumb} alt={song.title || 'song cover'} />
      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{artistName}</p>
      </div>
      <button className="button small" onClick={() => onPlay(song)} style={{ backgroundColor: isPlaying ? '#dc2626' : undefined }}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </article>
  )
}
