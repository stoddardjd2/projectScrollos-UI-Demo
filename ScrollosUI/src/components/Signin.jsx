import userIcon from "../assets/user.svg";
import passwordIcon from "../assets/password.svg";
export default function Signin() {
  const userID = "66a1688e70d0f4ce17d52f02";
  return (
    <div className="signin">
      <div>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <br />
        <div className="signin--input-box">
          <img src={userIcon} />
          <input id="username" placeholder="Enter your username"></input>
        </div>
        <label htmlFor="password">Password</label>
        <div className="signin--input-box">
          <img src={passwordIcon} />
          <input id="password" placeholder="Enter your password"></input>
        </div>
        <div className="signin--forgot-password">
          <a href="/forgotpassword">Forgot password?</a>
        </div>
        <br />
        <div className="signin--after-input-container">
          <div className="signin--login-container">
            {/* //ENTER USER ID! */}
            <a
              href={`/discover/${userID}`}
              className="button"
            >
              LOGIN
            </a>
          </div>
          <br />
          <br />
          <div>Or Sign Up Using</div>
          <br />
          OAUTH 2.0 OPTIONS HERE
          <br />
          <br />
          <a href="/signup" className="button">
            Or Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
