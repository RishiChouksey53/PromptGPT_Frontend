import React from "react";
import SideBar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import "./App.css";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThread, setCurrThread] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [latestReply, setLatestReply] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const providerValues = {
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
  return (
    <div className="main">
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}
