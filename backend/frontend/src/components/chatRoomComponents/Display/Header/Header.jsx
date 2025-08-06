import { useEffect, useState } from "react";
import styles from "./Header.module.css";

// General UI components
import UserLabel from "../../../general/UserLabel/UserLabel";
import Overlay from "../../../general/Overlay/Overlay";
import Option from "./Option/Option";
import Dropdown from "./Dropdown/Dropdown";

// Icon components
import {
  PlusIcon,
  LeaveIcon,
  SearchIcon,
  PencilIcon,
  ProfileIcon,
  SettingsIcon,
  ChatRoomIcon,
} from "../../../general/icons";

// Dropdown option components
import {
  JoinRoom,
  ChangeName,
  NewGroupForm,
  LeaveChatRoom,
  LogoutConfirmation,
  ChangeProfilePicture,
  ChangeGroupProfilePicture,
  FindUser,
} from "./dropdownOptions";

// Context
import useChatRoom from "../../../../contexts/chatRoom/useChatRoom";
import useAuth from "../../../../contexts/auth/useAuth";

function Header({ className }) {
  const { currentChat, isCreator, leaveChatRoom } = useChatRoom();
  const { user } = useAuth();
  const [isActive, setIsActive] = useState({
    settings: false,
    groupOptions: false,
  });
  const [dropdownFeatures, setDropdownFeatures] = useState({
    createGroupChat: false,
    roomSearch: false,
    userSearch: false,
    logoutConfirmation: false,
    changeName: false,
    leaveRoom: false,
    changeProfilePicture: false,
    changeGroupProfilePicture: false,
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
        {currentChat && (
          <>
            <UserLabel
              className={styles.userLabel}
              name={
                currentChat?.isGroup === true
                  ? currentChat.otherUser?.username ?? "Loading..."
                  : currentChat.name
              }
              imgSize={37}
              src={
                currentChat.isGroup
                  ? currentChat.otherUser.profilePicture?.url || null
                  : currentChat.profilePicture?.url
                  ? currentChat.profilePicture.url
                  : null
              }
            />
            {!currentChat.isGroup && (
              <span className={styles.joinCode}>
                Join Code: {currentChat?.joinCode || "999999"}
              </span>
            )}
            <Dropdown
              isActive={isActive.groupOptions}
              type={"groupOptions"}
              setIsActive={setIsActive}
              icon={
                <ChatRoomIcon
                  isActive={isActive}
                  className={styles.iconWrapper}
                  size={34}
                />
              }
            >
              {isCreator && (
                <>
                  <Option
                    className={styles.option}
                    icon={PencilIcon}
                    label={"Change Group Picture"}
                    onClick={() =>
                      setDropdownFeatures({
                        dropdownFeatures,
                        changeGroupProfilePicture: true,
                      })
                    }
                  />
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
                </>
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
            icon={PencilIcon}
            label={"Change Profile Picture"}
            condition={dropdownFeatures.changeProfilePicture}
            onClick={() =>
              setDropdownFeatures({
                dropdownFeatures,
                changeProfilePicture: true,
              })
            }
          />
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
            icon={ProfileIcon}
            onClick={() =>
              setDropdownFeatures({ dropdownFeatures, userSearch: true })
            }
            label={"Find Other Users"}
          />
          <Option
            className={styles.option}
            icon={SearchIcon}
            onClick={() =>
              setDropdownFeatures({ dropdownFeatures, roomSearch: true })
            }
            label={"Find Group Chats"}
          />

          <Option
            className={styles.option}
            icon={LeaveIcon}
            label={"Logout"}
            onClick={() =>
              setDropdownFeatures({
                dropdownFeatures,
                logoutConfirmation: true,
              })
            }
          />
        </Dropdown>

        {/* Put the dropdown features here */}
        <NewGroupForm
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <LeaveChatRoom
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <ChangeProfilePicture
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <LogoutConfirmation
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <JoinRoom
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <FindUser
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <ChangeName
          dropdownFeatures={dropdownFeatures}
          setDropdownFeatures={setDropdownFeatures}
        />
        <ChangeGroupProfilePicture
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
