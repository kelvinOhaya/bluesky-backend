import Login from "../../components/loginSignUp/Login";
import SignUp from "../../components/loginSignUp/SignUp";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";

function Register() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <button className={styles.goBack} onClick={() => navigate("/")}>
        &lt;
      </button>
      <h1 className={styles.title}>Let's Get You Situated</h1>
      <main className={styles.registerFormsContainer}>
        <Login />
        <SignUp />
      </main>
    </div>
  );
}

export default Register;
