import { Link } from "react-router-dom";
import icon from "./../assets/icon.svg";
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar--inner-container">
        <img src={icon} />
        <h1>Scrollos</h1>
      </div>

      <Link to="/about">About Us</Link>
      <Link to="/features">Features</Link>
      <Link to="/signin">Sign in</Link>
      <Link to="/signin">Register</Link>
    </div>
  );
}
