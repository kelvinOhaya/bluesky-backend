import styles from "./Home.module.css";
import "../../styles/global.css";
import twoPeopleTalking from "../../assets/twoPeopleTalking.png";
import { useNavigate } from "react-router-dom";
import excited from "../../assets/excited.png";

function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.background}>
      <h1
        style={{
          textAlign: "center",
          padding: "10px 10px",
          fontSize: "3rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        Blue Sky
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="64"
          height="64"
        >
          <path
            d="M48 28a12 12 0 0 0-23.52-3A8 8 0 0 0 16 32a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16z"
            fill="white"
          />
        </svg>
      </h1>
      <section className={styles.container}>
        <header className={styles.textContent}>
          <h1>Find True Connections</h1>
          <h3>With No Barriers</h3>
          <button onClick={() => navigate("./register")}>Start Here</button>
        </header>
        <figure className={styles.imgContent}>
          <img src={excited} className={styles.excitedIMG} />
          <img
            src={twoPeopleTalking}
            className={styles.twoPeopleTalkingIMG}
            alt="Title Screen"
          />
        </figure>
      </section>
    </div>
  );
}

export default Home;
