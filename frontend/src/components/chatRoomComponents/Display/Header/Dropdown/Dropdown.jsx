import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsIcon from "../../../../general/icons/SettingsIcon";
import styles from "./Dropdown.module.css";

const initial = {
  maxHeight: "0px",
  paddingBottom: "0px",
  paddingTop: "0px",
};

const animate = {
  maxHeight: "200px",
  paddingBottom: "10px",
  paddingTop: "10px",
};

function Dropdown({ isActive, setIsActive, icon, type, children }) {
  return (
    <div
      onMouseEnter={() => setIsActive({ isActive, [type]: true })}
      onMouseLeave={() => setIsActive({ isActive, [type]: false })}
      className={styles.container}
    >
      {icon}
      <AnimatePresence>
        {isActive && (
          <motion.nav
            initial={initial}
            animate={animate}
            exit={initial}
            transition={{ duration: "0.4", ease: "easeOut" }}
            className={styles.navbarContent}
          >
            {children}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
