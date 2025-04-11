import Login from "../components/loginSignUp/Login";
import SignUp from "../components/loginSignUp/SignUp";
import styles from "./register.module.css";
import "../styles/global.css";

function Register() {
  return (
    <div className={styles.background}>
      <nav>
        <button>{"<"}</button>
        <h1 className={styles.title}>Let's Get You Situated</h1>
      </nav>
      <main className={styles.container}>
        <Login />
        <SignUp />
      </main>
    </div>
  );
}

export default Register;
