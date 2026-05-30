import axios from "axios";

const API = "http://localhost:5000/api/chat";

export const sendMessageToBot =
  async (message) => {
console.log("Sending message to bot: ", message);
    const response = await axios.post(
      API,
      { message }
    );

    return response.data;
};

export default sendMessageToBot;