import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ChatRoom from "./pages/ChatRoom";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/" element={<Register />} /> */}
        <Route path="/" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
