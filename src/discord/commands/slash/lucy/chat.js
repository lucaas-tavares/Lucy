/* const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyDuR073neqNiVWW0SJRjVOMoHR8JEWm2XM"; // https://aistudio.google.com/app/

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

let history = [];

if (fs.existsSync("history.json")) {
    const historyData = fs.readFileSync("history.json");
    history = JSON.parse(historyData);
}

module.exports = {
    name: "test",
    description: "Inicia uma conversa com o bot",
    run: async (client, message, args) => {
        const userMessage = args.join(' '); // Junta os argumentos do comando

        const chat = model.startChat({
            history: history
        });

        await chat.sendMessage(userMessage).then(async (x) => {
            message.channel.send(x.response.text());

            history.push(
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                },
                {
                    role: "model",
                    parts: [{ text: x.response.text() }]
                }
            );

            fs.writeFileSync("history.json", JSON.stringify(history));
        });
    }
}; */