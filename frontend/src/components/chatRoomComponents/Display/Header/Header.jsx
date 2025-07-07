import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import UserLabel from "../../../general/UserLabel/UserLabel";
import Dropdown from "./Dropdown/Dropdown";
import SearchBar from "./SearchBar/SearchBar";
import NewGroupForm from "./NewGroupForm/NewGroupForm";
import LeaveChatRoom from "../LeaveChatRoom/LeaveChatRoom";
import SearchIcon from "../../../general/icons/SearchIcon";
import ChatroomIcon from "../../../general/icons/ChatroomIcon";
import Option from "./Option/Option";
import LeaveIcon from "../../../general/icons/LeaveIcon";
import PlusIcon from "../../../general/icons/PlusIcon";
import ProfileIcon from "../../../general/icons/ProfileIcon";
import useChatRoom from "../../../../contexts/chatRoom/useChatRoom";
import SettingsIcon from "../../../general/icons/SettingsIcon";
import LogoutConfirmation from "./LogoutConfirmation/LogoutConfirmation";
import Overlay from "../../../general/Overlay/Overlay";
import ChangeName from "./ChangeName/ChangeName";

// JOIN CODE: 8TgbQI

function Header({ className }) {
  const { currentChat, isCreator, leaveChatRoom } = useChatRoom();
  const [isActive, setIsActive] = useState({
    settings: false,
    groupOptions: false,
  });
  const [dropdownFeatures, setDropdownFeatures] = useState({
    createGroupChat: false,
    roomSearch: false,
    logoutConfirmation: false,
    changeName: false,
    leaveRoom: false,
  });

  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    for (const key of Object.keys(dropdownFeatures)) {
      if (dropdownFeatures[key]) {
        setActiveFeature({ key: key, value: dropdownFeatures[key] });
      } else setActiveFeature(null);
    }

    if (Object.values(dropdownFeatures).some((value) => value)) {
      setIsActive(false);
    }
  }, [dropdownFeatures]);

  return (
    <div className={className}>
      <div className={styles.container}>
        {currentChat != null && (
          <>
            <UserLabel
              className={styles.userLabel}
              name={currentChat?.name || "Group Name"}
              imgSize={37}
            />
            <span className={styles.joinCode}>
              Join Code: {currentChat?.joinCode || "888888"}
            </span>
            <Dropdown
              isActive={isActive.groupOptions}
              type={"groupOptions"}
              setIsActive={setIsActive}
              icon={
                <ChatroomIcon
                  isActive={isActive}
                  className={styles.iconWrapper}
                  size={34}
                />
              }
            >
              {isCreator && (
                <Option
                  className={styles.option}
                  icon={PlusIcon}
                  label={"Change Group Name"}
                  onClick={() =>
                    setDropdownFeatures({
                      dropdownFeatures,
                      changeName: true,
                    })
                  }
                />
              )}
              <Option
                className={styles.option}
                icon={LeaveIcon}
                label={"Leave Group"}
                onClick={() =>
                  setDropdownFeatures({
                    dropdownFeatures,
                    leaveRoom: true,
                  })
                }
              />
            </Dropdown>
          </>
        )}

        <Dropdown
          isActive={isActive.settings}
          setIsActive={setIsActive}
          type={"settings"}
          icon={
            <SettingsIcon
              isActive={isActive}
              className={styles.iconWrapper}
              size={34}
            />
          }
        >
          <Option
            className={styles.option}
            icon={PlusIcon}
            label={"Create Group Chat"}
            condition={dropdownFeatures.createGroupChat}
            onClick={() =>
              setDropdownFeatures({ dropdownFeatures, createGroupChat: true })
            }
          />
          <Option
            className={styles.option}
            icon={SearchIcon}
            onClick={() =>
              setDropdownFeatures({ dropdownFeatures, roomSearch: true })
            }
            label={"Find Chat/User"}
          />
          <Option
            className={styles.option}
            icon={ProfileIcon}
            label={"Logout"}
            onClick={() =>
              setDropdownFeatures({
                dropdownFeatures,
                logoutConfirmation: true,
              })
            }
          />
        </Dropdown>

        {/* Put the dopdown features here */}
        <NewGroupForm
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <LeaveChatRoom
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <LogoutConfirmation
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <SearchBar
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <ChangeName
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <Overlay
          dropdownFeatures={dropdownFeatures}
          getActiveFeature={() => activeFeature}
          setDropdownFeatures={setDropdownFeatures}
        />
      </div>
    </div>
  );
}

export default Header;
