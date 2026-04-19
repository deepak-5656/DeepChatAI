
import  "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {
        allThreads, setAllThreads,
        currThreadId, setcurrThreadId,
        setNewChat, setPrompt, setReply,
        setPrevChats,
        token,
        sidebarOpen, setSidebarOpen   
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${API_BASE_URL}/api/thread`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setcurrThreadId(newThreadId);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${API_BASE_URL}/api/thread/${newThreadId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${API_BASE_URL}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <>
            {}
            <div 
                className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <section className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                {}
                <div className="sidebar-top">
                    {}
                    <button className="sidebar-toggle" onClick={toggleSidebar} title={sidebarOpen ? "Close sidebar" : "Open sidebar"}>
                        <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>

                    {sidebarOpen && (
                        <>
                            {}
                            <div className="sidebar-brand">
                                <div className="sidebar-logo-icon">
                                    <i className="fa-solid fa-bolt"></i>
                                </div>
                                <span className="sidebar-brand-text">DeepChat</span>
                            </div>

                            {}
                            <button className="new-chat-btn" onClick={createNewChat} title="New chat">
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </>
                    )}

                    {}
                    {!sidebarOpen && (
                        <button className="new-chat-btn collapsed-new-chat" onClick={createNewChat} title="New chat">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    )}
                </div>

                {}
                {sidebarOpen && (
                    <ul className='history'>
                        {
                            allThreads?.map((thread, idx) => (
                                <li key={idx}
                                    onClick={() => changeThread(thread.threadId)}
                                    className={thread.threadId === currThreadId ? "highlighted" : " "}
                                >
                                    <i className="fa-regular fa-message thread-icon"></i>
                                    <span className="thread-title">{thread.title}</span>
                                    <i className="fa-solid fa-trash"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteThread(thread.threadId);
                                        }}
                                    ></i>
                                </li>
                            ))
                        }
                    </ul>
                )}

                {}
                {sidebarOpen && (
                    <div className="sign">
                        <p>By DeepChat &hearts;</p>
                    </div>
                )}
            </section>
        </>
    );
}

export default Sidebar;
