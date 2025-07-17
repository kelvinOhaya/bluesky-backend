import { motion } from "framer-motion";

const ChatRoomIcon = ({
  size = 24,
  color = "currentColor",
  className,
  isActive,
}) => (
  <motion.div
    className={className}
    style={{ top: "3px" }}
    animate={{ scale: isActive && isActive.groupOptions ? 1.2 : 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4C2.9 4 2 4.9 2 6V18L6 14H20C21.1 14 22 13.1 22 12V6C22 4.9 21.1 4 20 4H4Z"
        fill="currentColor"
      />
      <circle cx="8" cy="10" r="1.5" fill="#0d4ae2" />
      <circle cx="12" cy="10" r="1.5" fill="#0d4ae2" />
      <circle cx="16" cy="10" r="1.5" fill="#0d4ae2" />
    </svg>
  </motion.div>
);

export default ChatRoomIcon;
