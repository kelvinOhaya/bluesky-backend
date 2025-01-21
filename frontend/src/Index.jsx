import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/authentication/AuthProvider";
import ChatRoom from "./components/chatRoom/ChatRoom";
import Login from "./components/loginSignup/Login";
import SignUp from "./components/loginSignup/SignUp";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import chatRoomStyle from "./styles/ChatRoom.module.css"
import chatWindowStyle from "./styles/ChatWindow.module.css"
import groupSearchStyle from "./styles/GroupSearch.module.css"
import authStyle from "./styles/Auth.module.css"



export default function Index() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login styles={authStyle}/>} />
          <Route path="/signUp" element={<SignUp styles={authStyle} />} />
          <Route path="/chatRoom" element={
            <ProtectedRoute>
              <ChatRoom styles={chatRoomStyle} chatWindowStyle ={chatWindowStyle} groupSearchStyle={groupSearchStyle}/>
            </ProtectedRoute>
            } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
