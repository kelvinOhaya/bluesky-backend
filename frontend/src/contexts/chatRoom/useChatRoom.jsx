import { useContext } from "react";
import chatRoomContext from "./chatRoomContext";

const useChatRoom = () => useContext(chatRoomContext);

export default useChatRoom;
