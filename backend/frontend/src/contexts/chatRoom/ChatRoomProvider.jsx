import chatRoomContext from "./chatRoomContext";
import { useState, useEffect } from "react";
import useAuth from "../auth/useAuth";
import useSocket from "../socket/useSocket";
import api from "../../utils/api";
import { useRef } from "react";

function ChatRoomProvider({ children }) {
  const { user, isLoading, accessToken, fetchUser } = useAuth();
  const { socket } = useSocket();
  const [isCreator, setIsCreator] = useState(null);
  const [chatRooms, setChatRooms] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const prevRoomId = useRef();

  const activateChat = async (element) => {
    setMessages(null);
    console.log(socket.id);
    prevRoomId.current = currentChat?._id;
    await api.put("/chatroom/update-current-room", {
      currentRoomId: element._id,
      socketId: socket.id,
    });

    // console.log(data.success);
    setCurrentChat(element);
    setIsCreator(user._id === element.creator);
  };

  const loadChatRooms = async () => {
    try {
      const { data } = await api.get("/chatroom/send-info");

      data.chatRooms.map((chatRoom) => {
        if (chatRoom.isDm === true) {
          console.log(chatRoom);
        }
      });

      setChatRooms(data.chatRooms);
      setCurrentChat(data.currentChat);
    } catch (error) {
      if (error.response && error.response.status == 401) {
        console.log("Error trying to load the chat rooms: ", error);
      }
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await api.post("/chatroom/load-messages", {
        currentChatId: currentChat._id,
      });

      setMessages(data.messages);
    } catch (error) {
      console.log("Error loading all the messages: ", error);
    }
  };

  useEffect(() => {
    if (!currentChat) return;
  }, [currentChat]);

  //join a room when a chat is selected
  useEffect(() => {
    if (!currentChat) return;
    console.log(currentChat);
    socket.emit("join-room", {
      prevRoom: prevRoomId.current,
      newRoom: currentChat._id,
    });
  }, [currentChat]);

  //socket event listeners
  useEffect(() => {
    if (!socket) return;
    //utilities
    const handleReceiveMessage = (message) => {
      setMessages((prev) =>
        prev
          ? [...prev, { ...message, createdAt: Date.now() }]
          : [{ ...message, createdAt: Date.now() }]
      );
    };

    const updateCurrentChat = (foundChatRoom) => {
      console.log(
        `Here is the chatroom from the name change socket event: ${JSON.stringify(
          foundChatRoom
        )}`
      );
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === foundChatRoom._id
            ? {
                ...room,
                name: foundChatRoom.name,
                memberCount: foundChatRoom.memberCount,
              }
            : room
        )
      );
      setCurrentChat({ ...foundChatRoom });
    };

    const updateProfilePicture = async (foundUser) => {
      // console.log(
      //   "Event received with the following found user: \n",
      //   foundUser,
      //   "\n\nRequested from the user: \n",
      //   user
      // );
      if (foundUser._id === user._id) {
        await fetchUser(accessToken);
      }
      await Promise.all([loadMessages(), loadChatRooms()]);
    };

    const updateGroupProfilePicture = async (updatedChat) => {
      console.log("SOCKET EVENT RECEIVED!");
      setChatRooms((prev) => {
        return prev.map((room) =>
          updatedChat._id === room._id ? updatedChat : room
        );
      });
      setCurrentChat(updatedChat);
      console.log("FINAL RESULTS:\n", currentChat);
    };

    const handleUpdateMemberCount = (data) => {
      const { roomId, newMemberCount } = data;
      console.log(
        `User has left the room!! \nRoomId: ${roomId}\nNew Member Count: ${newMemberCount}`
      );
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, memberCount: newMemberCount } : room
        )
      );
      setCurrentChat((prev) => ({ ...prev, memberCount: newMemberCount }));
      console.log(newMemberCount);
    };

    const handleReduceMemberCount = (data) => {
      const { roomId } = data;
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? { ...room, memberCount: room.memberCount - 1 }
            : room
        )
      );
    };
    const handleUpdateChatRoomClient = (data) => {
      const roomExistsAlready =
        chatRooms.find((room) => room._id === data.updatedRoom._id) || null;

      console.log(
        `Here is your room: \n${
          JSON.stringify(data.updatedRoom) || null
        } \nRoomExistsAlready: ${roomExistsAlready}`
      );

      if (roomExistsAlready) {
        console.log("The Room Exists!");
        setChatRooms((prev) =>
          prev.map((room) =>
            room._id === data.updatedRoom._id
              ? { ...room, memberCount: data.updatedRoom.memberCount }
              : room
          )
        );
        setCurrentChat((prev) => ({
          ...prev,
          memberCount: data.updatedRoom.memberCount,
        }));
      } else {
        console.log("Unfortunately, the room does not exist :(");
        setChatRooms((prev) => [...prev, data.updatedRoom]);
      }
    };

    const handlePrintSuccess = () => {
      console.log("Socket Event received from express!!");
    };

    //listeners
    socket.on("receive-message", handleReceiveMessage);
    socket.on("print-success", handlePrintSuccess);
    socket.on("update-room-name", updateCurrentChat);
    socket.on("receive-photo-update", updateProfilePicture);
    socket.on("receive-group-photo-update", updateGroupProfilePicture);
    socket.on("reduce-member-count", handleReduceMemberCount);
    socket.on("update-member-count", handleUpdateMemberCount);
    socket.on("update-chat-room-client", handleUpdateChatRoomClient);

    return () => {
      socket.off("print-success", handlePrintSuccess);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("update-room-name", updateCurrentChat);
      socket.off("receive-photo-update", updateProfilePicture);
      socket.off("receive-group-photo-update", updateGroupProfilePicture);
      socket.off("reduce-member-count", handleReduceMemberCount);
      socket.off("update-member-count", handleUpdateMemberCount);
      socket.off("update-chat-room-client", handleUpdateChatRoomClient);
    };
  }, [socket, user, chatRooms, messages]);

  //initial load of all chatRooms and messages

  useEffect(() => {
    const getLoadedMessages = async () => {
      if (!currentChat) return;
      await loadMessages();
    };
    getLoadedMessages();
  }, [currentChat]);

  useEffect(() => {
    if (!currentChat) return;

    setIsCreator(user._id === currentChat.creator);
  }, [currentChat]);

  const verifyJoinCode = async (joinCode) => {
    try {
      const { data } = await api.post("/chatRoom/verify-join-code", {
        joinCode,
      });
      return data.isValid;
    } catch (error) {
      console.log("Error trying to verify join codes: ", error);
    }
  };
  const checkIfRoomExists = (joinCode) => {
    const roomExists = chatRooms.find((room) => room.joinCode === joinCode);
    return roomExists ? true : false;
  };

  const checkIfDmExists = (joinCode) => {
    const dmExists = chatRooms.find(
      (room) => room.otherUser?.joinCode === joinCode
    );
    return dmExists ? true : false;
  };
  const joinRoom = async (joinCode) => {
    try {
      const { data } = await api.post("/chatRoom/join", { joinCode });
      setChatRooms((prev) => (prev ? [...prev, data.newRoom] : [data.newRoom]));
      socket.emit("update-chat-room", {
        currentRoomId: data.newRoom._id,
        isDm: false,
      });
    } catch (error) {
      console.log("Error trying to verify join codes: ", error);
    }
  };

  const createGroup = async (groupName) => {
    const { data } = await api.post("/chatroom/", {
      senderId: user._id,
      name: groupName,
    });
    if (chatRooms != null) {
      setChatRooms([...chatRooms, data.newRoom]);
    } else {
      setChatRooms([data.newRoom]);
    }
    setCurrentChat(data.newRoom);
  };

  //send a delete request to "chatroom/leave-room"
  //call loadChatRooms again
  const leaveChatRoom = async () => {
    if (!currentChat?._id) return;
    try {
      await api.delete("/chatroom/leave-room", {
        data: { currentRoomId: currentChat?._id },
      });
      socket.emit("leave-room", { currentRoomId: currentChat._id });
      setChatRooms((prev) =>
        prev.filter((room) => room._id != currentChat._id)
      );
      setCurrentChat(null);

      //filter out the room upon delete. also current chat is on some bs and wont delete
      setMessages(null);
    } catch (error) {
      console.log("Error leaving chat room: ", error);
    }
  };

  const sendMessage = (chatRoomId, content) => {
    socket.emit("send-message", {
      chatRoomId,
      content,
      sender: user,
    });
  };

  const changeName = async (newName) => {
    //send put request to update name in mongoose
    try {
      const { data } = await api.put("/chatroom/change-name", {
        newName: newName,
        currentRoomId: currentChat._id,
      });

      //if all went well, emit a socket event to update EVERYONE's frontend
      socket.emit("change-room-name", data.foundChatRoom);

      //if all went well, update the frontend accordingly
    } catch (error) {
      console.log("Error trying to update the names: ", error);
    }
  };

  /**make an api call to the "/chatroom/find-user"**/
  const findUser = async (joinCode) => {
    const { data } = await api.post("/chatroom/find-user", {
      joinCode,
      socketId: socket.id,
    });
    console.log("NEW ROOM: \n", data.newRoom);
    socket.emit("update-chat-room", {
      userId: user._id,
      otherUserId: data.otherUserId,
      currentRoomId: data.newRoom._id,
      isDm: true,
    });
    setChatRooms((prev) => [...prev, data.newRoom]);
    setCurrentChat(data.newRoom);
  };

  return (
    <chatRoomContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        messages,
        setMessages,
        currentChat,
        setCurrentChat,
        isCreator,
        setIsCreator,
        createGroup,
        verifyJoinCode,
        joinRoom,
        checkIfRoomExists,
        checkIfDmExists,
        activateChat,
        leaveChatRoom,
        findUser,
        loadChatRooms,
        sendMessage,
        changeName,
      }}
    >
      {children}
    </chatRoomContext.Provider>
  );
}

export default ChatRoomProvider;
