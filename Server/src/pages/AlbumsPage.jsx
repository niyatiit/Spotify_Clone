import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAlbums, getArtistAlbums } from '../services/musicApi'
import { useAuth } from '../context/AuthContext'
import AlbumCard from '../components/AlbumCard'

export default function AlbumsPage() {
  const { user } = useAuth()
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const isArtist = user?.role === 'artist'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    
    const fetchAlbums = isArtist ? getArtistAlbums() : getAllAlbums()
    
    fetchAlbums
      .then((res) => {
        if (!cancelled) {
          setAlbums(res.data.albums || [])
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Unable to load albums')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isArtist])

  return (
    <div className="page-wrapper">
      <h2>{isArtist ? 'My Albums' : 'Albums'}</h2>
      <p>{isArtist ? 'View and manage all albums you have created.' : 'Explore all albums on the platform.'}</p>

      {loading && <p>Loading albums...</p>}
      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {!loading && !error && albums.length === 0 && <p>{isArtist ? 'No albums created yet.' : 'No albums found.'}</p>}
        {!loading && !error && albums.map((album) => (
          <AlbumCard
            key={album._id || album.id}
            album={album}
            onSelect={() => navigate(`/albums/${album._id || album.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

