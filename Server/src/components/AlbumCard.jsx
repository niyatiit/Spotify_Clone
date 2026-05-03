const placeholderImages = [
  'https://picsum.photos/seed/album-1/240/240',
  'https://picsum.photos/seed/album-2/240/240',
  'https://picsum.photos/seed/album-3/240/240',
  'https://picsum.photos/seed/album-4/240/240',
  'https://picsum.photos/seed/album-5/240/240',
]

const getAlbumPlaceholder = (seedString) => {
  let hash = 0
  for (let i = 0; i < seedString.length; i += 1) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % placeholderImages.length
  return placeholderImages[index]
}

export default function AlbumCard({ album, onSelect }) {
  const artistName = album.artist?.username || album.artist?.email || 'Unknown Artist'
  const firstSongImage = album.musics?.[0]?.image
  const seed = album._id || album.id || album.title
  const cover = firstSongImage || getAlbumPlaceholder(seed)

  return (
    <article className="card album-card" onClick={() => onSelect(album)}>
      <img className="album-image" src={cover} alt={album.title || 'album cover'} />
      <div className="album-info">
        <h3>{album.title}</h3>
        <p>{artistName}</p>
      </div>
    </article>
  )
}
