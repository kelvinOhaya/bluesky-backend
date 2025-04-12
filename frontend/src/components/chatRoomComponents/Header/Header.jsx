import { useState } from "react";
import styles from "./Header.module.css";
import UserLabel from "../../general/UserLabel/UserLabel";
import SlidingNavbar from "../../general/SlidingNavbar/SlidingNavbar"; // adjust path as needed

function Header({ className }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={className}>
      <div className={styles.container}>
        <UserLabel
          imgStyling={styles.verticalProfilePic}
          className={styles.userLabel}
          name={"Friend's Name"}
        />
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(true)}
        >
          ☰
        </button>
      </div>

      <SlidingNavbar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <span className={styles.closeBtnContainer}>
          <button
            className={styles.closeBtn}
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </span>
        <UserLabel
          className={styles.slidingNavbarUserLabel}
          name={"Username"}
          orientation={"vertical"}
        />

        <ul className={styles.navList}>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </SlidingNavbar>
    </div>
  );
}

export default Header;
