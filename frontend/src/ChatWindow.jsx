import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from 'react';
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId,
        prevChats, setPrevChats,
        setNewChat,
        token,
        user,
        logout,
        sidebarOpen, setSidebarOpen   
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const getReply = async () => {
        if (!prompt.trim()) return;  
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${API_BASE_URL}/api/chat`, options);

            if (response.status === 401) {
                logout();
                navigate("/");
                return;
            }

            const data = await response.json();
            setReply(data.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]);
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Get user's first initial for the avatar
    const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="ChatWindow">
            <div className="navbar">
                <div className="navbar-left">
                    {}
                    {!sidebarOpen && (
                        <button
                            className="navbar-sidebar-toggle"
                            onClick={() => setSidebarOpen(true)}
                            title="Open sidebar"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    )}
                    <span className="navbar-title">DeepChat</span>
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">{userInitial}</span>
                </div>
            </div>

            {}
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem user-info">
                        <i className="fa-solid fa-circle-user"></i>
                        <div>
                            <strong>{user?.name}</strong>
                            <small>{user?.email}</small>
                        </div>
                    </div>
                    <div className="dropDown-divider"></div>
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDown-divider"></div>
                    <div className="dropDownItem logout-item" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            }

            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="userBox">
                    <input type="text" placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key == 'Enter' ? getReply() : ''}
                    ></input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    DeepChat can make mistakes. Check important info.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;