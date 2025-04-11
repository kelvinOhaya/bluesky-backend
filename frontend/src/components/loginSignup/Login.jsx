import styles from "./LoginSignUp.module.css";

function Login() {
  return (
    <section className={styles.loginContainer}>
      <h1>Login</h1>
      <form className={styles.registerContainer}>
        <div>
          <label>Username </label>
          <input id="Username" type="text" />
        </div>
        <div>
          <label>Password </label>
          <input type="password" />
        </div>
        <span>
          <button>Login</button>
        </span>
      </form>
    </section>
  );
}

export default Login;
