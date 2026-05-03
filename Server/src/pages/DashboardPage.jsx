import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getAllSongs } from "../services/musicApi";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const isArtist = user?.role === "artist";
  const [songCount, setSongCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingCount(true);

    getAllSongs()
      .then((res) => {
        if (!cancelled) {
          setSongCount(res.data.musics?.length || 0);
        }
      })
      .catch(() => {
        if (!cancelled) setSongCount(0);
      })
      .finally(() => {
        if (!cancelled) setLoadingCount(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page-wrapper">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#7da5d7",
              fontSize: "0.85rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {isArtist ? "Artist Dashboard" : "User Dashboard"}
          </p>
          <h1 style={{ margin: "0.5rem 0 0", fontSize: "2rem" }}>
            Welcome back, {user?.username || user?.email}
          </h1>
          <p
            style={{
              margin: "1rem 0 0",
              color: "var(--text-secondary)",
              maxWidth: "720px",
              lineHeight: 1.7,
            }}
          >
            {isArtist
              ? "Use your artist tools to manage uploads and reach listeners across the platform."
              : "Enjoy a clean music experience with easy playback, beautiful cover art, and quick access to your favorite tracks."}
          </p>
        </div>
        <button
          className="button secondary"
          onClick={logout}
          style={{ minWidth: "140px", height: "42px" }}
        >
          Logout
        </button>
      </header>

      <section className="card-grid" style={{ marginTop: "1.5rem" }}>
        <div
          className="card"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "1.25rem",
          }}
        >
          <span className="counter">Music Count</span>
          <h3 style={{ margin: "0.75rem 0 0" }}>
            {loadingCount ? "Loading..." : `${songCount} songs ready to play`}
          </h3>
          <p style={{ marginTop: "0.75rem", color: "var(--text-secondary)" }}>
            Stream any track on demand, with track covers and smooth playback
            from your dashboard.
          </p>
        </div>

        <div
          className="card"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "1.25rem",
          }}
        >
          <span className="counter">Your Activity</span>
          <h3 style={{ margin: "0.75rem 0 0" }}>
            {isArtist ? "Upload and manage songs" : "Listen anytime"}
          </h3>
          <p style={{ marginTop: "0.75rem", color: "var(--text-secondary)" }}>
            {isArtist
              ? "Add new tracks, build albums, and track your artist catalog."
              : "Browse songs, discover new covers, and pause/play with better controls."}
          </p>
        </div>

        <div
          className="card"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "1.25rem",
          }}
        >
          <span className="counter">Quick Links</span>
          <h3 style={{ margin: "0.75rem 0 0" }}>Get to music fast</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <Link
              className="button"
              to="/songs"
              style={{ color: "white" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
            >
              Browse Songs
            </Link>

            {isArtist && (
              <Link
                className="button"
                to="/artist"
                style={{ color: "white" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#1db954")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
              >
                Artist Console
              </Link>
            )}
          </div>
        </div>
      </section>

      {!isArtist && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>More from your dashboard</h2>

          <div className="card-grid">
            <div
              className="card"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "1.25rem",
              }}
            >
              <h3>Fresh cover art</h3>
              <p
                style={{ marginTop: "0.75rem", color: "var(--text-secondary)" }}
              >
                Every song shows attractive cover art, even if the artist did
                not upload one.
              </p>
            </div>

            <div
              className="card"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "1.25rem",
              }}
            >
              <h3>Easy listening</h3>
              <p
                style={{ marginTop: "0.75rem", color: "var(--text-secondary)" }}
              >
                Play, pause, and control your music with responsive buttons and
                a clear player layout.
              </p>
            </div>

            <div
              className="card"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "1.25rem",
              }}
            >
              <h3>Start exploring</h3>
              <p
                style={{ marginTop: "0.75rem", color: "var(--text-secondary)" }}
              >
                Jump into the songs page and discover the latest tracks uploaded
                by artists.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
