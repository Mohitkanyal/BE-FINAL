import React, { useState, useRef, useEffect } from "react";
import SideBar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { Send } from "lucide-react";

export default function Responses() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your Scrum Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    
    // Clear input
    setInput("");

    // Simulate bot response (replace this with API call)
    setTimeout(() => {
      const botReply = `You said: "${input}". I will process this request.`;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 800);
  };

  // Send message on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 flex flex-col h-full">
          <h1 className="text-2xl font-bold mb-6">Developer Chat with Bot</h1>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-[#1f1f1f] rounded-xl shadow space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-xs break-words ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 rounded-xl bg-[#1f1f1f] border border-gray-700 text-white focus:outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 flex items-center justify-center"
              onClick={sendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
