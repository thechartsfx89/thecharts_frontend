"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

// 🔌 Connect socket globally (once)
const socket = io(process.env.NEXT_PUBLIC_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default function Chat({ mentorId = 25 }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [textMessage, setTextMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const userId = 24; // Demo logged-in user
  const selectedUser = { userId: mentorId }; // Chat target (mentor)

  // ✅ Scroll helper
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✅ Join chat *after socket connects*
  const joinChat = () => {
    console.log("📡 Joining chat rooms...");
    socket.emit("joinChat", { userId, mentorId });
  };

  // ✅ Fetch messages from Strapi
  const fetchMessages = async () => {
    try {
      const receiver = selectedUser?.userId || null;
      let query = receiver
        ? `filters[$or][0][sender][$eq]=${userId}&filters[$or][1][receiver][$eq]=${userId}&filters[$or][2][sender][$eq]=${receiver}&filters[$or][3][receiver][$eq]=${receiver}`
        : `filters[receiver][$null]=true`;

      console.log("🗂 Fetching messages...");
      // const res = await axios.get(
      //   `http://localhost:1337/api/messages?${query}&sort=createdAt:ASC`
      // );

      // ✅ Correct mapping for Strapi v5
      // const data = res.data?.data?.map((m: any) => ({
      //   id: m.id,
      //   ...m.text,
      // }));

      // console.log("✅ Loaded messages:", res.data?.data || []);
      // setMessages(res.data?.data || []);
      scrollToBottom();
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  };

  // ✅ Setup socket listeners (only once)
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      joinChat(); // join when connected
      fetchMessages(); // then load chat history
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔴 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    socket.on("newMessage", (msg) => {
      const message = msg?.attributes ? msg.attributes : msg;
      console.log("📩 New message received:", message);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("newMessage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Send message
  const sendMessage = () => {
    if (!textMessage.trim()) return;
    const receiver = selectedUser?.userId || null;

    console.log("📤 Sending message:", {
      sender: userId,
      receiver,
      text: textMessage.trim(),
    });

    socket.emit("sendMessage", {
      sender: userId,
      receiver,
      text: textMessage.trim(),
    });

    setTextMessage("");
    scrollToBottom();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-full border rounded-md shadow-md">
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No messages yet</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 my-1 rounded-md w-fit max-w-[70%] ${
              msg?.sender == userId
                ? "bg-blue-100 ml-auto text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            <div className="text-sm">{msg?.text}</div>
            <div className="text-xs text-gray-400 mt-1">
              {msg?.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString()
                : ""}
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <div className="flex items-center border-t p-2 bg-white">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 outline-none"
          placeholder="Type a message..."
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
