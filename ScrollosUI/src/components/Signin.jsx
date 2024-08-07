import userIcon from "../assets/user.svg";
import passwordIcon from "../assets/password.svg";
import { useState } from "react";
export default function Signin() {
  const [form, setForm] = useState({ username: "", password: "" });

  function handleInput(e) {
    const id = e.target.id;
    const value = e.target.value;
    console.log(id);
    setForm(prev => ({ ...prev, [id]: value }));
  }

  async function handleLogin() {
    
    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    }).then((res) => {
      if (res.status == 202) {
        res.json().then((data) => {
          window.location.href = `/discover/${data._id}`
        });
      } else {
        alert("Incorrect username/password");
      }
    });
  }


  const userID = "66a1688e70d0f4ce17d52f02";
  return (
    <div className="signin-background">
      <div className="signin">
        <div>
          <h1>Login</h1>
          <label htmlFor="username">Username</label>
          <br />
          <div className="signin--input-box">
            <img src={userIcon} />
            <input
              value={form.username}
              onChange={handleInput}
              className="input-field"
              id="username"
              placeholder="Enter your username"
            ></input>
          </div>
          <label htmlFor="password">Password</label>
          <div className="signin--input-box">
            <img src={passwordIcon} />
            <input
              value={form.password}
              onChange={handleInput}
              className="input-field"
              id="password"
              placeholder="Enter your password"
            ></input>
          </div>
          <div className="signin--forgot-password">
            <a href="/forgotpassword">Forgot password?</a>
          </div>
          <br />
          <div className="signin--after-input-container">
            <div className="signin--login-container">
              {/* //ENTER USER ID! */}
              <button onClick={handleLogin} className="button btn login">
                LOGIN
              </button>
            </div>
            <br />
            <br />
            <div>Or Sign Up Using</div>
            <br />
            OAUTH 2.0 OPTIONS HERE
            <br />
            <br />
            <br />
            <br />
            <a href="/signup" className="button bottom-signup btn">
              Or Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
