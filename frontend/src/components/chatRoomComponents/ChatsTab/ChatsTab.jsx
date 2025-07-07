// Import the UserLabel component for displaying chat room/user info
import UserLabel from "../../general/UserLabel/UserLabel";
// Import the UserPortion component (likely shows current user info/profile)
import UserPortion from "./UserPortion/UserPortion";
// Import CSS module for styling
import styles from "./ChatsTab.module.css";
import { useState } from "react";
// Custom hook for accessing chat room state and actions
import useChatRoom from "../../../contexts/chatRoom/useChatRoom";

// ChatsTab displays the list of chat rooms the user is a member of, and allows switching between them
function ChatsTab({ className }) {
  // Destructure chat room state and actions from context
  const { chatRooms, currentChat, setCurrentChat, activateChat } =
    useChatRoom();

  return (
    // Main container for the chat tab, receives optional className for layout
    <div className={className} style={{ overflow: "hidden" }}>
      {/* Shows the current user's info/profile at the top of the tab */}
      <UserPortion />
      {/* Container for the list of chat room buttons */}
      <div className={styles.tabButtonContainer}>
        {/* Only render chat rooms if chatRooms is a valid array */}
        {Array.isArray(chatRooms) ? (
          chatRooms
            // Filter out any null/undefined or malformed chat room objects
            .filter((chatRoom) => chatRoom && chatRoom._id)
            .map((chatRoom) => {
              return (
                // Each chat room is a button; clicking activates that chat room
                <button
                  className={
                    styles.tabButton +
                    // Highlight the button if this chat room is currently active
                    (currentChat?._id === chatRoom._id
                      ? " " + styles.active
                      : "")
                  }
                  style={{ overflow: "hidden" }}
                  key={chatRoom._id}
                  onClick={async () => await activateChat(chatRoom)}
                >
                  {/* UserLabel displays the chat room's name horizontally */}
                  <UserLabel
                    className={styles.userLabel}
                    name={chatRoom.name}
                    orientation={"horizontal"}
                  />
                </button>
              );
            })
        ) : (
          // Fallback if there are no chat rooms yet
          <div style={{ color: "white", fontSize: "1.2rem" }}>No Chats Yet</div>
        )}
      </div>
    </div>
  );
}

// Export the ChatsTab component for use in other parts of the app
export default ChatsTab;
