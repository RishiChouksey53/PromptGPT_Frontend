import React, { useEffect, useRef } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";
import { useContext } from "react";
import { ScaleLoader } from "react-spinners";
import { useState } from "react";
import { clientServer } from "./config/index.jsx";

export default function ChatWindow() {
  const {
    userProfile,
    prompt,
    setPrompt,
    reply,
    setReply,
    currThread,
    setPrevChats,
    isSideBarOpen,
    setIsSideBarOpen,
    setIsAuthenticated,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const textAreaRef = useRef(null);
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef?.current?.focus();
    }
  }, [isSideBarOpen]);
  const getReply = async () => {
    try {
      setLoading(true);
      const response = await clientServer.post(
        "/api/chat",
        {
          message: prompt,
          threadId: currThread,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReply(response.data.reply);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //Append new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  function closeSideBar() {
    if (isSideBarOpen) {
      setIsSideBarOpen(false);
    }
    if (isProfileOpen) {
      setIsProfileOpen(false);
    }
  }

  return (
    <div className="chatWindow" onClick={closeSideBar}>
      <div className="navbar">
        <div className="navLogo">PromptGPT</div>
        <div
          className="navSideBar"
          onClick={() => {
            setIsSideBarOpen(!isSideBarOpen);
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </div>
        <div
          className="navProfile"
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
          }}
        >
          <img src="/profile.png" alt="profile" />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="navProfileOptions"
          style={isProfileOpen == 0 ? { display: "none" } : {}}
        >
          <ul>
            <li style={{ color: "grey" }}>
              <i
                style={{ color: "grey" }}
                className="fa-solid fa-circle-user"
              ></i>
              {userProfile.email}
            </li>
            <li>
              <i className="fa-solid fa-arrow-up-from-bracket"></i>Upgrade plan
            </li>
            <li>
              <i className="fa-solid fa-gear"></i> Settings
            </li>
            <li>
              <i className="fa-brands fa-hire-a-helper"></i> Help
            </li>
            <li
              onClick={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>Log out
            </li>
          </ul>
        </div>
      </div>
      <Chat></Chat>
      {loading && <ScaleLoader color="#fff"></ScaleLoader>}
      <div className="inputArea">
        <div className="chatInput">
          <div className="userInput">
            <textarea
              ref={textAreaRef}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={(e) => {
                e.key === "Enter" ? getReply() : "";
              }}
              placeholder="Ask anything"
              value={prompt}
              name=""
              id=""
            ></textarea>
          </div>
          <div className="options">
            <div className="optionsLeft">
              <i className="fa-solid fa-plus"></i>
              <i className="fa-solid fa-sliders"></i>{" "}
            </div>
            <div className="optionsRight">
              <i className="fa-solid fa-microphone"></i>
              <i
                className="fa-solid fa-arrow-up"
                style={
                  prompt.length && !loading
                    ? { backgroundColor: "white", color: "black" }
                    : { pointerEvents: "none" }
                }
                onClick={getReply}
              ></i>
            </div>
          </div>
        </div>
        <p className="footer">
          PromptGPT can make mistakes. Check important info.{" "}
          <a href="">See Cookie Preferences.</a>
        </p>
      </div>
    </div>
  );
}
