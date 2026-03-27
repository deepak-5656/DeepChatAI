import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from "./MyContext.jsx";
import { useContext, useState,useEffect } from 'react';
import { ScaleLoader } from "react-spinners";


function ChatWindow(){
    const { prompt, setPrompt, reply, setReply,currThreadId, prevChats,setPrevChats,setNewChat} = useContext(MyContext);
    const [loading,setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
         setNewChat(false);

    console.log("message",prompt, "threadid",currThreadId);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({       
            message: prompt,
            threadId: currThreadId
        })
    };
    try {
        const response = await fetch("http://localhost:8080/api/chat", options);  // ✅ pass options
        const data = await response.json();
        console.log(data);
        setReply(data.reply);         
    } catch (err) {
        console.log(err);
    }
    setLoading(false);
};

// append new chat to prevchats
useEffect(()=>{
    if(prompt && reply){
        setPrevChats(prevChats => [
    ...prevChats,
    {
        role: "user",
        content: prompt
    },
    {
        role: "assistant",
        content: reply
    }
]);
    }
    setPrompt("");
},[reply])

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }


return (
         <div className="ChatWindow">
            <div className="navbar">
                <span>DeepChat <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv"  onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }

            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}>


            </ScaleLoader>
            <div className="chatInput">
               <div className="userBox">
                <input type="text"  placeholder="Ask anything"
                     value = {prompt}
                    onChange={(e)=>setPrompt(e.target.value) }
                    onKeyDown={(e)=>e.key=='Enter'?getReply():''}
                >
                 </input>
                 
                 <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
               </div>
               <p className="info">
                DeepChat can make mistakes.Check important info.
               </p>

            </div>

         </div>
    )
}

export default ChatWindow;