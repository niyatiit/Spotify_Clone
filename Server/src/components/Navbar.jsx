import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="main-navbar">
      <div className="brand">Spotify Clone</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/albums">Albums</Link>
        <Link to="/songs">Songs</Link>
      </div>
      <div className="auth-controls">
        {isAuthenticated ? (
          <>
            <span className="current-user">{user?.username || user?.email}</span>
            <button className="button secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="button" to="/login">Login</Link>
            <Link className="button" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
