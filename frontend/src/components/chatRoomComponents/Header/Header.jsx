import { useState } from "react";
import styles from "./Header.module.css";
import UserLabel from "../../general/UserLabel/UserLabel";
import Option from "../../general/Option/option";
import SearchIcon from "../../general/icons/SearchIcon";
import Dropdown from "../../general/Dropown/Dropdown";
import { FiEdit2 } from "react-icons/fi";
import PlusIcon from "../../general/icons/PlusIcon";
import { motion } from "framer-motion";

function Header({ className }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className={className}>
      <div className={styles.container}>
        <UserLabel
          imgStyling={styles.horizontalProfilePic}
          className={styles.userLabel}
          name={"Friend's Name"}
          imgSize={45}
        />

        <Dropdown
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          isOpen={isMenuOpen}
        />
      </div>
    </div>
  );
}

export default Header;
