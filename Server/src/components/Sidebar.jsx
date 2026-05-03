import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <h4>Library</h4>
      <NavLink className="sidebar-link" to="/dashboard">Dashboard</NavLink>
      <NavLink className="sidebar-link" to="/albums">Albums</NavLink>
      <NavLink className="sidebar-link" to="/songs">Songs</NavLink>
      <NavLink className="sidebar-link" to="/artist">Artist</NavLink>
      <NavLink className="sidebar-link" to="/upload-song">Upload Song</NavLink>
      <NavLink className="sidebar-link" to="/upload-album">Upload Album</NavLink>
    </aside>
  );
}
