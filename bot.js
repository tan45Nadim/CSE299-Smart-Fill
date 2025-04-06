require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const { handleStart } = require("./handlers/startHandler");
const { handleStop } = require("./handlers/stopHandler");
const {
  handleInformation,
  handleFileUpload,
} = require("./handlers/downloadHandler");
const { handleSubmit } = require("./handlers/submitHandler");

const { handleForm } = require("./handlers/formHandler");
const { handleFormSubmit } = require("./handlers/formSubmitHandler");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => handleStart(msg, bot));
bot.onText(/\/stop/, (msg) => handleStop(msg, bot));
bot.onText(/\/information/, (msg) => handleInformation(msg, bot));
bot.on("document", (msg) => handleFileUpload(msg, bot));
bot.onText(/\/submit-information/, (msg) => handleSubmit(msg, bot));

// Form handling
bot.onText(/\/form/, (msg) => handleForm(msg, bot));
bot.onText(/\/submitForm/, (msg) => handleFormSubmit(msg, bot));

console.log("🤖 Bot is running...");
