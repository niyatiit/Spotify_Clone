import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const featuredSongs = [
  { id: 1, title: 'Ocean Floor', artist: 'Nova Echo' },
  { id: 2, title: 'Midnight Drive', artist: 'Sonic Tide' },
  { id: 3, title: 'Pulse of the City', artist: 'The Skylines' }
]

const featuredAlbums = [
  { id: 1, name: 'Moonlit Beats', artist: 'Lunar Atlas' },
  { id: 2, name: 'Neon Nights', artist: 'Synthwave Union' },
  { id: 3, name: 'Aurora Rhythms', artist: 'Celestial Vibe' }
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const goToMusic = () => {
    if (isAuthenticated) {
      navigate('/songs')
    } else {
      navigate('/register')
    }
  }

  const goToAuth = (path) => navigate(path)

  return (
    <div className="home-page">
      {/* <Navbar /> */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Spotify Clone</h1>
          <p>
            Discover your next favorite song, album, and playlist. Build your music world
            with a modern, dark navy theme experience.
          </p>
          <div className="hero-buttons">
            <button className="button primary" onClick={goToMusic}>Explore Music</button>
            <button className="button" onClick={() => goToAuth('/login')}>Login</button>
            <button className="button" onClick={() => goToAuth('/register')}>Register</button>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Songs</h2>
        <div className="card-grid">
          {featuredSongs.map((song) => (
            <article key={song.id} className="feature-card">
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
              <button onClick={goToMusic}>Listen</button>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Albums</h2>
        <div className="card-grid">
          {featuredAlbums.map((album) => (
            <article key={album.id} className="feature-card">
              <h3>{album.name}</h3>
              <p>{album.artist}</p>
              <button onClick={goToMusic}>Explore</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
