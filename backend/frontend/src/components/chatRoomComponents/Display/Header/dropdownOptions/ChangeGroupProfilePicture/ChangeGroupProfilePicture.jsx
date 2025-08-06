import { useState, useCallback, useRef } from "react";
import styles from "../ChangeProfilePicture/ChangeProfilePicture.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "../../../../../general/icons";
import useAuth from "../../../../../../contexts/auth/useAuth";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import { useDropzone } from "react-dropzone";
import api from "../../../../../../utils/api";
import useSocket from "../../../../../../contexts/socket/useSocket";

function ChangeGroupProfilePicture({ dropdownFeatures, setDropdownFeatures }) {
  const { user, setUser } = useAuth();
  const { messages, setMessages, currentChat, setCurrentChat } = useChatRoom();
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    if (!preview || preview.length === 0) return;
    const formData = new FormData(e.target);
    formData.append("image", preview[0]);
    formData.append("roomId", currentChat._id);
    try {
      const { data } = await api.post(
        "/upload/group-profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.foundChatRoom) {
        // setIsLoading(false);
        socket.emit("update-group-profile-picture", data.foundChatRoom);
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.log(
          "Error from the server when trying to upload to cloudinary: ",
          JSON.stringify(error, null, 2)
        );
      }
    } finally {
      setIsLoading(false);
      setDropdownFeatures({
        ...dropdownFeatures,
        changeGroupProfilePicture: false,
      });
      setPreview(null);
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
      {dropdownFeatures.changeGroupProfilePicture && (
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

export default ChangeGroupProfilePicture;
