import React, { useEffect } from "react";
import SideBar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import "./App.css";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import Auth from "./Auth.jsx";
import { clientServer } from "./config/index.jsx";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThread, setCurrThread] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [latestReply, setLatestReply] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const providerValues = {
    isAuthenticated,
    setIsAuthenticated,
    userProfile,
    setUserProfile,
    prompt,
    setPrompt,
    reply,
    setReply,
    currThread,
    setCurrThread,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    latestReply,
    setLatestReply,
    isSideBarOpen,
    setIsSideBarOpen,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await clientServer.get("/user/verify_token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
        setUserProfile(response.data.user);
      } catch (err) {
        console.error("Token verification failed:", err.message);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  return (
    <div className="main">
      <MyContext.Provider value={providerValues}>
        {isAuthenticated ? (
          <>
            <SideBar />
            <ChatWindow />
          </>
        ) : (
          <Auth />
        )}
      </MyContext.Provider>
    </div>
  );
}
