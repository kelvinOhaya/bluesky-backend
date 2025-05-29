import styles from "./Option.module.css";
import { useState } from "react";
import { motion } from "framer-motion";

function option({ content, icon = <div> </div>, className }) {
  return (
    <div className={className}>
      <span>{icon}</span>
      <p>{content}</p>
    </div>
  );
}

export default option;
