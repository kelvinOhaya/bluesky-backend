import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatRoomProvider from "./contexts/chatRoom/chatRoomProvider";
import SocketProvider from "./contexts/socket/socketProvider";
import AuthProvider from "./contexts/auth/AuthProvider";

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chatroom"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <ChatRoomProvider>
                    <ChatRoom />
                  </ChatRoomProvider>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;
