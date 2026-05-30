export default function ChatMessage({
  sender,
  text,
}) {

  return (

    <div
      className={
        sender === "user"
          ? "text-right mb-3"
          : "text-left mb-3"
      }
    >

      <div
        className={
          sender === "user"
            ? "inline-block bg-black text-white px-4 py-2 rounded-lg"
            : "inline-block bg-gray-200 px-4 py-2 rounded-lg"
        }
      >
        {text}
      </div>

    </div>
  );
}