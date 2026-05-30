import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./pages/components/Navbar";
import Upload from "./pages/components/Upload_ProfileP";
import Profile from "./pages/Profile";
import Chatbot from "./pages/testbot";
import Chat from "./services/chatApi";

function App() {
    return (
        <Router>
              <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                 <Route path="/login" element={<Login />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/upload" element={<Upload />} />
                 <Route path="/testbot" element={<Chatbot />} />
                 <Route path="/chat" element={<Chat />} />
              </Routes>
        </Router>
    );
}

export default App;