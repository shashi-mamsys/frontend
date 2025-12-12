import React, { useState, useRef, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { SiMusicbrainz } from "react-icons/si";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // DEFAULT GREETING AFTER 1–3 SECONDS (NO TYPING)
  // --------------------------------------------------
  useEffect(() => {
    if (open && messages.length === 0) {
      const delay = Math.floor(Math.random() * 2000) + 1000;

      setTimeout(() => {
        setMessages([
          {
            id: Date.now(),
            sender: "bot",
            text: "Hey there! I'm your assistant. How can I help you?",
          },
        ]);
      }, delay);
    }
  }, [open]);

  // --------------------------------------------------
  // SEND MESSAGE + BACKEND CALL
  // --------------------------------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userText },
    ]);

    setInput("");

    // Show typing animation ONLY for backend messages
    setBotTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setBotTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.reply || "I received your message!",
        },
      ]);
    } catch (err) {
      setBotTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "⚠️ Server connection failed.",
        },
      ]);
    }
  };

  // AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, botTyping]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all"
      >
        <SiMusicbrainz size={30} />
      </button>

      {/* Chat Box */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "440px" }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chat Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl hover:text-gray-200"
            >
              <MdOutlineClose />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
          >
            {/* Render all messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] text-sm shadow ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* BOT TYPING (ONLY FOR BACKEND RESPONSE) */}
            {botTyping && (
              <div className="flex justify-start">
                <div className="bg-white border text-gray-600 px-3 py-2 rounded-xl rounded-bl-none max-w-[75%] shadow flex gap-1 items-center">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-150">●</span>
                  <span className="animate-bounce delay-300">●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition"
            >
              <IoSendSharp />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
