import chatRoomContext from "./chatRoomContext";
import { useState, useEffect } from "react";
import useAuth from "../auth/useAuth";
import useSocket from "../socket/useSocket";
import api from "../../utils/api";

function ChatRoomProvider({ children }) {
  const { user, isLoading, accessToken } = useAuth();
  const { socket } = useSocket();
  const [isCreator, setIsCreator] = useState(null);
  const [chatRooms, setChatRooms] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);

  const activateChat = async (element) => {
    const { data } = await api.put("/chatroom/update-current-room", {
      currentRoomId: element._id,
    });

    // console.log(data.success);
    setCurrentChat(element);
    setIsCreator(user._id === element.creator);
    console.log(isCreator);
  };

  //join a room when a chat is selected
  useEffect(() => {
    if (!currentChat) return;

    socket.emit("join-room", currentChat._id);
  }, [currentChat]);

  //socket event listeners
  useEffect(() => {
    if (!socket) return;
    //utilities
    const handleReceiveMessage = (message) => {
      console.log("Event received!");
      setMessages((prev) => (prev ? [...prev, message] : [message]));
    };

    const updateCurrentChat = (foundChatRoom) => {
      console.log("We found this chat room: ", foundChatRoom);
      console.log("We found this new name: ", foundChatRoom.name);
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === foundChatRoom._id ? foundChatRoom : room
        )
      );
      setCurrentChat(foundChatRoom);
    };

    //listeners
    socket.on("receive-message", handleReceiveMessage);
    socket.on("update-room-name", updateCurrentChat);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("update-room-name", updateCurrentChat);
    };
  }, [socket]);

  //initial load of all chatRooms and messages
  useEffect(() => {
    // loadMessage()
    const fetchChatRooms = async () => {
      if (!isLoading && user && accessToken && socket != null) {
        await loadChatRooms();
      }
    };

    fetchChatRooms();
  }, [isLoading, user, accessToken, socket]);

  const loadChatRooms = async () => {
    try {
      const { data } = await api.get("/chatroom/send-info");

      setChatRooms(data.chatRooms);
      setCurrentChat(data.currentChat);
    } catch (error) {
      if (error.response && error.response.status == 401) {
        console.log("Error trying to load the chat rooms: ", error);
      }
    }
  };

  useEffect(() => {
    const getLoadedMessages = async () => {
      if (!currentChat) return;
      await loadMessages();
    };
    getLoadedMessages();
  }, [currentChat]);

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
    if (!chatRooms) return;

    console.log(chatRooms);
  }, [chatRooms]);

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

  const joinRoom = async (joinCode) => {
    try {
      const { data } = await api.post("/chatRoom/join", { joinCode });
      setChatRooms((prev) => (prev ? [...prev, data.newRoom] : [data.newRoom]));
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
      const result = await api.delete("/chatroom/leave-room", {
        data: { currentRoomId: currentChat?._id },
      });
      console.log("Loaded twin");
      const { data } = await api.get("/chatroom/send-info");
      setChatRooms(data.chatRooms);
      setCurrentChat(null);
    } catch (error) {
      console.log("Error leaving chat room: ", error);
    }
  };

  const sendMessage = (chatRoomId, content) => {
    socket.emit("send-message", {
      chatRoomId,
      content,
      sender: user.username,
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
        createGroup,
        verifyJoinCode,
        joinRoom,
        activateChat,
        leaveChatRoom,
        sendMessage,
        changeName,
      }}
    >
      {children}
    </chatRoomContext.Provider>
  );
}

export default ChatRoomProvider;
