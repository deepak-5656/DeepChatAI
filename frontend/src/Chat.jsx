import "./Chat.css";
import { useContext, useState, useEffect } from 'react';
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from  "rehype-highlight";
import   "highlight.js/styles/github-dark.css";

function Chat(){
    const { newChat, prevChats, reply, user, isNewUser, setIsNewUser } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        if (!newChat) {
            setIsNewUser(false);
        }
    }, [newChat]);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); 
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" "); 

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

     return (
         <>
            {}
            {newChat && (
                <div className="welcome-container">
                    {}
                    {isNewUser ? (
                        <div className="welcome-hero">
                            <div className="welcome-icon welcome-wave">
                                <i className="fa-solid fa-hand-sparkles"></i>
                            </div>
                            <h1 className="welcome-title">
                                Welcome, <span className="welcome-name">{user?.name || "there"}</span>!
                            </h1>
                            <p className="welcome-subtitle">
                                Your account is all set up. I'm DeepChat, your AI assistant — ask me anything to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="welcome-hero">
                            <div className="welcome-icon">
                                <i className="fa-solid fa-bolt"></i>
                            </div>
                            <h1 className="welcome-title">
                                {getGreeting()}, <span className="welcome-name">{user?.name || "there"}</span>
                            </h1>
                            <p className="welcome-subtitle">How can I help you today?</p>
                        </div>
                    )}

                    {}
                    <div className="welcome-suggestions">
                        <div className="suggestion-chip">
                            <i className="fa-solid fa-lightbulb"></i>
                            <span>Explain a concept</span>
                        </div>
                        <div className="suggestion-chip">
                            <i className="fa-solid fa-code"></i>
                            <span>Help me code</span>
                        </div>
                        <div className="suggestion-chip">
                            <i className="fa-solid fa-pen-fancy"></i>
                            <span>Write something</span>
                        </div>
                        <div className="suggestion-chip">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <span>Analyze & research</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} >
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"} >
                                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                                )

                            }
                        </>
                    )
                }

            </div>
        </>
    )
}

export default Chat;

