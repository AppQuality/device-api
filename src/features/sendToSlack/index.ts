import axios from "axios";

const sendToSlack = async (message: string) => {
  console.log(message);
  const response = await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: message,
  });
  return response;
};

export default sendToSlack;
