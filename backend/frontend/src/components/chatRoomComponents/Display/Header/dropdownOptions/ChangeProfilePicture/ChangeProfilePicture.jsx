import { useState, useCallback, useRef } from "react";
import styles from "./ChangeProfilePicture.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "../../../../../general/icons";
import useAuth from "../../../../../../contexts/auth/useAuth";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import { useDropzone } from "react-dropzone";
import api from "../../../../../../utils/api";
import useSocket from "../../../../../../contexts/socket/useSocket";

function ChangeProfilePicture({ dropdownFeatures, setDropdownFeatures }) {
  const { user, setUser } = useAuth();
  const { messages, setMessages, currentChat } = useChatRoom();
  const { socket } = useSocket();
  const { isLoading, setIsLoading } = useState(false);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const onDrop = useCallback((acceptedFiles) => {
    setPreview(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview === null) return;
    const formData = new FormData(e.target);
    formData.append("image", preview[0]);
    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const { data } = await api.post("/upload/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.foundUser) {
        // setIsLoading(false);
        socket.emit("update-profile-picture", {
          user: user,
          currentRoomId: currentChat._id,
        });
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.log(
          "Error from the server when trying to upload to cloudinary: ",
          error.response.data
        );
      }
    } finally {
      setDropdownFeatures({
        ...dropdownFeatures,
        changeProfilePicture: false,
      });
      console.log("Currently, the user is: \n", user);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
  });

  return (
    <AnimatePresence>
      {dropdownFeatures.changeProfilePicture && (
        <motion.form
          className={styles.container}
          initial={{ left: "-400px" }}
          animate={{ left: "50%" }}
          exit={{ left: " 105%" }}
          transition={{ duration: "0.3" }}
          onSubmit={handleSubmit}
        >
          <h5 style={{ paddingBottom: "10px" }}>Enter Profile Picture Here</h5>

          <div {...getRootProps()}>
            <input
              ref={fileRef}
              {...getInputProps()}
              type="file"
              id="choose-file"
            />
            {
              <span>
                {preview != null ? (
                  preview.map((file, index) => (
                    <img key={index} src={file.preview} />
                  ))
                ) : (
                  <PlusIcon
                    size={120}
                    className={styles.plusIcon}
                    type="file"
                  />
                )}
              </span>
            }
          </div>
          <button type="submit">Confirm</button>
          {isLoading && <p>Loading...</p>}
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default ChangeProfilePicture;
