import { useState } from "react";

export default function ChatInput({
  onSend,
}) {

  const [message, setMessage] =
    useState("");

  const handleSend = () => {

    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (

    <div className="flex gap-2 p-3 border-t">
      <input
        type="text"
        placeholder="Ask about jobs..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        className="flex-1 border rounded-lg p-2"
      />
         
      <button
        onClick={handleSend}
        className="bg-black text-white px-4 rounded-lg"
      >
        Send
      </button>

    </div>
  );
}