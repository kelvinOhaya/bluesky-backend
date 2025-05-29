// SlidingNavbar.jsx
// This component renders a sliding navigation bar that appears from the side of the screen.
// Props:
// - isOpen: Boolean to control if the navbar is visible.
// - onClose: Function to close the navbar when the overlay is clicked.
// - children: The content to display inside the navbar.
import { useState } from "react";
import { motion } from "framer-motion";
import SettingsIcon from "../icons/SettingsIcon";
import SearchIcon from "../icons/SearchIcon";
import Option from "../Option/Option";
import styles from "./Dropdown.module.css";
import PlusIcon from "../icons/PlusIcon";
import ProfileIcon from "../icons/ProfileIcon";

function Dropdown({ children }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={styles.container}
    >
      <SettingsIcon
        className={styles.settingsIcon}
        size={34}
        isHovering={isHovering}
      />

      <nav className={styles.navbarContent}>
        <div>
          <Option
            className={styles.option}
            icon={<PlusIcon size={10} className={styles.iconWrapper} />}
            content={"Create Group Chat"}
          />
          <Option
            className={styles.option}
            icon={
              <SearchIcon
                size={10}
                className={styles.iconWrapper}
                color={"white"}
              />
            }
            content={"Room Search"}
          />
          <Option
            className={styles.option}
            icon={
              <ProfileIcon className={styles.iconWrapper} color={"white"} />
            }
            content={"Logout"}
          />
        </div>
      </nav>
    </div>
  );
}

export default Dropdown;
