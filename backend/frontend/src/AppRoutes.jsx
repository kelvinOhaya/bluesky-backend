import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatRoomProvider from "./contexts/chatRoom/ChatRoomProvider";
import SocketProvider from "./contexts/socket/SocketProvider";
import AuthProvider from "./contexts/auth/AuthProvider";
//the app routes
function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <ChatRoomProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/chatroom"
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ChatRoomProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;
