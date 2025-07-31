import React, { useContext, useEffect } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext";
import axios from "axios";
import { clientServer } from "./config";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    reply,
    setPrompt,
    setReply,
    setCurrThread,
    setLatestReply,
    setPrevChats,
    setNewChat,
    isSideBarOpen,
    setIsSideBarOpen,
  } = useContext(MyContext);
  const getAllThreads = async () => {
    try {
      const response = await clientServer.get("/api/get_all_thread", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const filterdData = response.data.threads.map((thread) => ({
        threadId: thread.threadId,
        title:
          thread.title.length >= 22
            ? thread.title.substring(0, 21) + ".."
            : thread.title,
      }));
      setAllThreads(filterdData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId, reply]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThread(uuidv1());
    setPrevChats([]);
    setLatestReply(null);
  };

  const changeThread = async (threadId) => {
    setCurrThread(threadId);
    try {
      const thread = await clientServer.get("/api/get_thread_by_id", {
        params: {
          threadId: threadId,
        },
      });
      setPrevChats(thread.data.thread.messages);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await clientServer.delete("/api/delete_thread_by_id", {
        params: {
          threadId: threadId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      getAllThreads();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!allThreads.length) {
      createNewChat();
    }
  }, [allThreads]);

  return (
    <section className="sidebar" style={isSideBarOpen ? { left: "0" } : {}}>
      <div className="btn">
        <div className="logoBtnAndX">
          <div
            className="gptLogo"
            onClick={() => {
              createNewChat();
              setIsSideBarOpen(false);
            }}
          >
            <img src="/logo.png" alt="gpt logo" />
          </div>
          <i
            className="fa-solid fa-xmark"
            onClick={() => {
              setIsSideBarOpen(false);
            }}
          ></i>
        </div>
        <div
          className="editBtn"
          onClick={() => {
            createNewChat();
            setIsSideBarOpen(false);
          }}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          New Chat
        </div>
      </div>

      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => {
              changeThread(thread.threadId);
              setIsSideBarOpen(false);
            }}
          >
            {thread.title}{" "}
            <i
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
                console.log("click trash");
              }}
              className="fa-solid fa-trash"
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By RC</p>
      </div>
    </section>
  );
}
