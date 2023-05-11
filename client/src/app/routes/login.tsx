import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/userSlice";
import "../../styles/login.scss";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.currentTarget.value);
  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.currentTarget.value);

  return (
    <form
      className="login-register-form"
      onSubmit={(e) => {
        e.preventDefault();
        fetch("http://localhost:8888/api/login", {
          method: "POST",
          credentials: "include",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.loggedIn) {
              dispatch(login(data.user));
              navigate("/");
            } else {
              setError(data.message);
            }
          })
          .catch((error) => console.log(error));
      }}
    >
      <input
        type={"text"}
        placeholder="Username"
        value={username}
        onChange={changeUsername}
      />
      <br />
      <input
        type={"password"}
        placeholder="Password"
        autoComplete="on"
        value={password}
        onChange={changePassword}
      />
      <label id="error">{error}</label>
      <input type={"submit"} value="Login" />
    </form>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.currentTarget.value);
  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.currentTarget.value);

  return (
    <form
      className="login-register-form"
      onSubmit={(e) => {
        e.preventDefault();
        fetch("http://localhost:8888/api/users", {
          method: "POST",
          credentials: "include",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.userCreated) {
              dispatch(login(data.user));
              navigate("/");
            } else setError(data.message);
          });
      }}
    >
      <input
        type={"text"}
        placeholder="Enter a username"
        value={username}
        onChange={changeUsername}
      />
      <br />
      <input
        type={"password"}
        placeholder="Enter a password"
        autoComplete="on"
        value={password}
        onChange={changePassword}
      />
      <label id="error">{error}</label>
      <input type={"submit"} value="Register and Login" />
    </form>
  );
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8888/api/login", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          dispatch(login(data.user));
          navigate("/");
        }
      });
  }, []);
  const [register, setRegister] = useState<boolean>(false);

  const loginRegister = () => {
    if (register)
      return (
        <>
          Already have an account
          <button id="login-button" onClick={() => setRegister(!register)}>
            Login here
          </button>
          <p>Register with us Today!</p>
          <RegisterForm />
        </>
      );
    else
      return (
        <>
          Need an account
          <button id="login-button" onClick={() => setRegister(!register)}>
            Create one here
          </button>
          <p>Login here</p>
          <LoginForm />
        </>
      );
  };

  return (
    <div id="login">
      <header>
        <h1>Tom's App</h1>
        <h2>desctiption</h2>
        <h3>Join Today!</h3>
      </header>
      <div id="login-container">{loginRegister()}</div>
    </div>
  );
};

export default Login;
