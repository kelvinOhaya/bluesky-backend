import styles from "./Home.module.css";
import "../../styles/global.css";
import twoPeopleTalking from "../../assets/twoPeopleTalking.png";
import { useNavigate } from "react-router-dom";
import excited from "../../assets/excited.png";

function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.background}>
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
