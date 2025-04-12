import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import ChatRoom from "./pages/chatRoom/ChatRoom";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} />  */}
        <Route path="/" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
