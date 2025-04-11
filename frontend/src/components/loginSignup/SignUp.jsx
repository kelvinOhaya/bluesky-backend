import styles from "./LoginSignUp.module.css";

function SignUp() {
  return (
    <section className={styles.signUpContainer}>
      <h1>Sign Up</h1>
      <form className={styles.registerContainer}>
        <div>
          <label>Username </label>
          <input type="text" />
        </div>
        <div>
          <label>Password </label>
          <input type="password" placeholder="at least 8 characters" />
        </div>
        <div>
          <label>{"Password (again)"} </label>
          <input type="password" placeholder="at least 8 characters" />
        </div>
        <span>
          <button>Sign Up</button>
        </span>
      </form>
    </section>
  );
}

export default SignUp;
