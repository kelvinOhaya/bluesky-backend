import React from "react";
import styles from "./Option.module.css";

const Option = ({ icon: Icon, label, onClick }) => {
  return (
    <>
      <button className={styles.option} onClick={onClick}>
        {Icon && (
          <span className={styles.iconWrapper}>
            <Icon />
          </span>
        )}
        <p>{label}</p>
      </button>
    </>
  );
};

export default Option;
