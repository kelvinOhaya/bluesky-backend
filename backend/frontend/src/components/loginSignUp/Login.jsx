import styles from "./LoginSignUp.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../contexts/auth/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [usernameOrPasswordIsIncorrect, setUsernameOrPasswordIsIncorrect] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = userData;

    const loginStatus = await login({ username, password });
    if (loginStatus === 200) {
      const last = localStorage.getItem("lastVisited") || "/chatroom";
      navigate(last);
    } else {
      setUsernameOrPasswordIsIncorrect(true);
    }
  };

  return (
    <section className={styles.container}>
      <h1>Login</h1>
      <form className={styles.formsContainer} onSubmit={handleLogin}>
        <div>
          <label>Username </label>
          <input
            id="Username"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            type="text"
          />
        </div>
        <div>
          <label>Password </label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />
        </div>
        {usernameOrPasswordIsIncorrect && (
          <p className={styles.error}>*Username Or Password Is Incorrect</p>
        )}
        <span>
          <button type="submit">Login</button>
        </span>
      </form>
    </section>
  );
}

export default Login;
