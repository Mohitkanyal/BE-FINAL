import React, { useState } from "react";
import { Search, Bell, Send, UserPlus } from "lucide-react";
import SideBar from "../components/Sidebar";
import { useSelector } from "react-redux";
import avatar from '../asset/person.jpg';

const TeamChat = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", avatar: avatar, text: "Hey team, any updates on the sprint?", time: "09:00 AM" },
    { id: 2, user: "Bob", avatar: avatar, text: "Yes, I finished my tasks!", time: "09:05 AM" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMsg = {
      id: messages.length + 1,
      user: "You",
      avatar: avatar,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
          <h1 className="text-2xl font-bold">Team Chat</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search messages"
                className="pl-8 pr-3 py-2 rounded-md bg-[#2a2a2a] text-sm text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <Bell className="cursor-pointer text-gray-300 hover:text-white" />
            <UserPlus className="cursor-pointer text-gray-300 hover:text-white" />
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Chat content */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{msg.user}</span>
                      <span className="text-gray-400 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 bg-[#1b1b1b] border-l border-gray-700 p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Team Members */}
            <div>
              <h3 className="font-semibold mb-3">Team Members</h3>
              <ul className="space-y-2">
                {["Alice", "Bob", "Charlie", "David"].map((member, i) => (
                  <li key={i} className="flex items-center gap-3 bg-[#2a2a2a] p-3 rounded-md">
                    <img src={avatar} alt={member} className="w-8 h-8 rounded-full" />
                    <span>{member}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between bg-[#2a2a2a] p-3 rounded-md cursor-pointer hover:bg-[#374151]">
                  <span>Start Meeting</span>
                  <span className="text-blue-400">Go</span>
                </li>
                <li className="flex justify-between bg-[#2a2a2a] p-3 rounded-md cursor-pointer hover:bg-[#374151]">
                  <span>Create Task</span>
                  <span className="text-green-400">New</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TeamChat;
