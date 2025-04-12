import styles from "./Home.module.css";
import "../../styles/global.css";
import twoPeopleTalking from "../../assets/twoPeopleTalking.png";
import excited from "../../assets/excited.png";

function Home() {
  return (
    <div className={styles.background}>
      <h1 className={styles.title}>Chat App</h1>
      <section className={styles.container}>
        <header className={styles.textContent}>
          <h1>Find True Connections</h1>
          <h3>With No Barriers</h3>
          <button>Start Here</button>
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
