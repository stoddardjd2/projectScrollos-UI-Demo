import { Link } from "react-router-dom";
import icon from "./../assets/icon.svg";
export default function Navbar() {
function handleHome(){
  window.location.href = `/`;
}

  return (
    <div className="navbar">
      <div onClick={handleHome} className="navbar--home-container">
        <img src={icon} />
        {/* <h1>Scrollos</h1> */}
      </div>

      <Link className="link" to="/about">About Us</Link>
      <Link className="link" to="/features">Features</Link>
      <div className="action-container">
      <Link className="link signup" to="/signup">Signup</Link>
      <Link className="link" to="/signin">Sign in</Link>
        <div/>
   
      </div>
 

    </div>
  );
}
