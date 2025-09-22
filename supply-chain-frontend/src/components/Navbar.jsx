import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>AgriChain</h1>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login/Register</Link>
        <Link to="/view-blockchain">View Blockchain</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </nav>
  );
}
