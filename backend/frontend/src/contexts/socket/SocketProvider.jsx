import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import socketContext from "./socketContext";
import useAuth from "../auth/useAuth";

function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_BASE_BACKEND_URL, {
      autoConnect: false,
      auth: { userId: user._id },
    });
    setSocket(socket);
  }, [user]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

export default SocketProvider;
