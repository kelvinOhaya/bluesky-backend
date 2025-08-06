import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import socketContext from "./socketContext";

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_L_BASE_BACKEND_URL);
    setSocket(socket);

    return () => socket.disconnect();
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

export default SocketProvider;
