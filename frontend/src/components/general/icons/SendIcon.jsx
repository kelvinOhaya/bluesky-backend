import { motion } from "framer-motion";

function SendIcon({ size = 34, isHovering, className }) {
  return (
    <div className={className}>
      <motion.svg
        style={{
          padding: "5px",
          borderRadius: "100%",
        }}
        animate={{
          background: isHovering ? "#FFFFFF" : "#0D4AE2",
          fill: isHovering ? "#0D4AE2" : "#FFFFFF",
        }}
        transition={{ duration: "0.1", type: "tween" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
      </motion.svg>
    </div>
  );
}

export default SendIcon;
