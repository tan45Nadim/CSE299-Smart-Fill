const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getUserPaths, ensureUserFolders } = require("../helpers/utils");

const handleInformation = (msg, bot) => {
  const userId = msg.from.id;
  ensureUserFolders(userId);
  bot.sendMessage(
    msg.chat.id,
    "📤 Please upload your PDF, DOC, or image files now."
  );
};

const handleFileUpload = async (msg, bot) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const fileId = msg.document.file_id;
  const fileName = msg.document.file_name;

  try {
    ensureUserFolders(userId);

    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    const { DOWNLOADS_DIR } = getUserPaths(userId);
    const filePath = path.join(DOWNLOADS_DIR, fileName);

    const response = await axios.get(fileUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      bot.sendMessage(chatId, `✅ File saved: ${fileName}`);
    });
  } catch (error) {
    console.error("❌ Error downloading file:", error);
    bot.sendMessage(chatId, "Failed to download file.");
  }
};

module.exports = { handleInformation, handleFileUpload };
