import { useState } from "react";

import ChatMessage from "./ChatMessages";

import ChatInput from "./ChatInput";

import {sendMessageToBot} from "../../chatApi";


export default function ChatWidget() {

  const [messages, setMessages] =
    useState([]);

  const handleSend = async (message) => {

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {
      console.log("Sending message to bot: ", message);
      const data =
        await sendMessageToBot(message);

      const botMessage = {
        sender: "bot",
        text: data.reply,
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (error) {

      console.error(error);

    }
  };

  return (

    <div
      className="
      fixed
      bottom-5
      right-5
      w-[400px]
      bg-white
      shadow-2xl
      rounded-2xl
      border
      "
    >

      <div
        className="
        p-4
        font-bold
        border-b
        "
      >
        AI Career Assistant
      </div>

      <div
        className="
        h-[450px]
        overflow-y-auto
        p-4
        "
      >

        {messages.map((msg, index) => (

          <ChatMessage
            key={index}
            sender={msg.sender}
            text={msg.text}
          />

        ))}

      </div>

      <ChatInput onSend={handleSend} />

    </div>
  );
}