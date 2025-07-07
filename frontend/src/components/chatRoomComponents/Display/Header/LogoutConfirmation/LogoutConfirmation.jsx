import Overlay from "../../../../general/Overlay/Overlay";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LogoutConfirmation.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../../contexts/auth/useAuth";

function LogoutConfirmation({ dropdownFeatures, setDropdownFeatures }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <AnimatePresence>
        {dropdownFeatures.logoutConfirmation && (
          <motion.div
            className={styles.container}
            initial={{ left: "-400px" }}
            animate={{ left: "50%" }}
            exit={{ left: "120%" }}
            transition={{ duration: "0.3" }}
          >
            <p>Are you sure you want to log out?</p>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={() =>
                  setDropdownFeatures({
                    dropdownFeatures,
                    logoutConfirmation: false,
                  })
                }
              >
                No
              </button>
              <button onClick={handleLogout}>Yes</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LogoutConfirmation;
