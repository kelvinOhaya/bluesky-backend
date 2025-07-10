import { useState, useCallback } from "react";
import styles from "./ChangeProfilePicture.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "../../../../../general/icons";
import { useDropzone } from "react-dropzone";

function ChangeProfilePicture({ dropdownFeatures, setDropdownFeatures }) {
  const [preview, setPreview] = useState(null);
  const onDrop = useCallback((accpetedFiles) => {
    console.log(accpetedFiles[0]);
    setPreview(
      accpetedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <AnimatePresence>
      {dropdownFeatures.changeProfilePicture && (
        <motion.form
          {...getRootProps()}
          className={styles.container}
          initial={{ left: "-400px" }}
          animate={{ left: "50%" }}
          exit={{ left: " 105%" }}
          transition={{ duration: "0.3" }}
        >
          <h5 style={{ paddingBottom: "10px" }}>Enter Profile Picture Here</h5>
          <label htmlFor="choose-file">
            <span>
              {preview != null ? (
                preview.map((file) => <img src={file.preview} />)
              ) : (
                <PlusIcon size={120} className={styles.plusIcon} type="file" />
              )}
            </span>
          </label>
          <input {...getInputProps()} type="file" id="choose-file" hidden />
          <button type="submit">Confirm</button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default ChangeProfilePicture;
