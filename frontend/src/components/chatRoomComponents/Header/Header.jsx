import { useState } from "react";
import styles from "./Header.module.css";
import UserLabel from "../../general/UserLabel/UserLabel";
import SlidingNavbar from "../../general/SlidingNavbar/SlidingNavbar"; // adjust path as needed
import Option from "../../general/Option/option";
import SearchIcon from "../../general/icons/SearchIcon/SearchIcon";
import { FiEdit2 } from "react-icons/fi";
import PlusIcon from "../../general/icons/PlusIcon/PlusIcon";

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
        <button
          className={styles.closeBtn}
          onClick={() => setIsMenuOpen(false)}
        >
          ×
        </button>
        <UserLabel
          className={styles.slidingNavbarUserLabel}
          name={"Username"}
          orientation={"vertical"}
        />

        <ul className={styles.optionsContainer}>
          <Option className={styles.optionStyling}>
            <p>Edit Profile</p>
            <FiEdit2 className={styles.editIcon} />
          </Option>
          <Option className={styles.optionStyling}>
            <p>Find Groups</p>
            <SearchIcon className={styles.searchIcon} />
          </Option>
          <Option className={styles.optionStyling}>
            <p>Create Group</p> <PlusIcon />
          </Option>
          <Option className={styles.optionStyling + " " + styles.logout}>
            <p>Logout</p>
          </Option>
        </ul>
      </SlidingNavbar>
    </div>
  );
}

export default Header;
