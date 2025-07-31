import React, { useContext, useState } from "react";
import "./Auth.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { clientServer } from "./config";
import { ScaleLoader } from "react-spinners";
import { MyContext } from "./MyContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [passVisibility, setPasswordVisibility] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUserProfile, setIsAuthenticated } = useContext(MyContext);

  function reset() {
    setEmail("");
    setName("");
    setPassword("");
    setUsername("");
  }
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await clientServer.post("/user/login", {
        username,
        password,
      });
      setIsError(false);
      setIsAuthenticated(true);
      setUserProfile(user.data.user);
      setMessage(user.data.message);
      localStorage.setItem("token", user.data.token);
    } catch (err) {
      if (err?.response?.data?.error) {
        setMessage(err.response.data.error);
        setIsError(true);
      } else if (err?.response?.data?.message) {
        setIsError(true);
        setMessage(err.response.data.message);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
      reset();
      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 2500);
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const user = await clientServer.post("/user/register", {
        name,
        username,
        email,
        password,
      });
      if (user.status === 201) {
        setIsLogin(!isLogin);
      }
      setIsError(false);
      setMessage(user.data.message);
    } catch (err) {
      if (err?.response?.data?.error) {
        setMessage(err.response.data.error);
        setIsError(true);
      } else if (err?.response?.data?.message) {
        setIsError(true);
        setMessage(err.response.data.message);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
      reset();
      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 2500);
    }
  };

  return (
    <div className="mainContainer">
      <h1>{isLogin ? "Login" : "SignUp"}</h1>
      {message && (
        <p style={{ color: isError ? "#F44336" : "#4CAF50" }}>{message}</p>
      )}
      <div className="container">
        <div className="left">
          {!isLogin && (
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              label="name"
              variant="outlined"
            />
          )}
          <TextField
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            id="username"
            label="username"
            variant="outlined"
          />
          {!isLogin && (
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              label="email"
              variant="outlined"
            />
          )}
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            label="password"
            type={passVisibility ? "password" : "text"}
            variant="outlined"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                isLogin ? handleLogin() : handleRegister();
              }
            }}
          />
          {!passVisibility ? (
            <i
              onClick={() => {
                setPasswordVisibility(!passVisibility);
              }}
              className="fa-solid fa-eye eye"
            ></i>
          ) : (
            <i
              onClick={() => {
                setPasswordVisibility(!passVisibility);
              }}
              className="fa-solid fa-eye-slash eye"
            ></i>
          )}
          <Button
            onClick={isLogin ? handleLogin : handleRegister}
            variant="contained"
          >
            {isLogin ? "login" : "signup"}
          </Button>
        </div>
        <div className="right">
          {isLogin ? (
            <h3>Don't have an account </h3>
          ) : (
            <h3>Already have an account</h3>
          )}
          <Button
            onClick={() => {
              setIsError(false);
              setMessage(false);
              setIsLogin(!isLogin);
            }}
            variant="contained"
          >
            {isLogin ? "SignUP" : "Login"}
          </Button>
        </div>
      </div>
      {/* {!isLoading && (
        <div>
          <div className="loadingDiv">
            <ScaleLoader color="#fff"></ScaleLoader>
          </div>
        </div>
      )} */}
    </div>
  );
}
