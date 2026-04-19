import './App.css'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import AuthPage from "./AuthPage.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

    const [token, setToken] = useState(localStorage.getItem("deepchat_token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("deepchat_user"))
    );

    const [isNewUser, setIsNewUser] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setcurrThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    // LOGIN — called after successful auth
    // The `firstTime` parameter tells us if user just signed up
    const login = (newToken, newUser, firstTime = false) => {
        setToken(newToken);
        setUser(newUser);
        setIsNewUser(firstTime);
        localStorage.setItem("deepchat_token", newToken);
        localStorage.setItem("deepchat_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsNewUser(false);
        localStorage.removeItem("deepchat_token");
        localStorage.removeItem("deepchat_user");
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPrevChats([]);
        setNewChat(true);
        setAllThreads([]);
    };

    const isAuthenticated = !!token;

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setcurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads,
        token, user, login, logout, isAuthenticated,
        // NEW values:
        sidebarOpen, setSidebarOpen,    // Sidebar toggle
        isNewUser, setIsNewUser         // First-time welcome
    };

    return (
        <MyContext.Provider value={providerValues}>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? <Navigate to="/chat" replace />
                            : <AuthPage />
                    }
                />
                <Route
                    path="/chat"
                    element={
                        isAuthenticated
                            ? (
                                <div className='app'>
                                    <Sidebar />
                                    <ChatWindow />
                                </div>
                            )
                            : <Navigate to="/" replace />
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </MyContext.Provider>
    );
}

export default App;
