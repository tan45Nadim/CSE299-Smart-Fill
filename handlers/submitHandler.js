const fs = require("fs");
const path = require("path");
const {
  getUserPaths,
  cleanUserFolders,
  ensureUserFolders,
} = require("../helpers/utils");
const { sendToGemini } = require("../helpers/sendToGemini");

const handleSubmit = async (msg, bot) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  ensureUserFolders(userId);

  const { DOWNLOADS_DIR, TEMP_DIR, FINAL_JSON } = getUserPaths(userId);

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    return bot.sendMessage(
      chatId,
      "⚠️ No files found. Please upload them first."
    );
  }

  const files = fs.readdirSync(DOWNLOADS_DIR);
  if (files.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠️ No files found. Please upload them first."
    );
  }

  let finalJson = {};

  for (const file of files) {
    const filePath = path.join(DOWNLOADS_DIR, file);

    try {
      const geminiData = await sendToGemini(
        filePath,
        process.env.GEMINI_API_KEY
      );
      finalJson[file] = geminiData;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      await bot.sendMessage(
        chatId,
        `❌ Failed to process ${file}. Please try again later.`
      );
    }
  }

  // Save merged JSON result
  fs.writeFileSync(FINAL_JSON, JSON.stringify(finalJson, null, 2));

  // ✅ Send the JSON file back to the user (most stable method)
  try {
    await bot.sendMessage(
      chatId,
      "✅ Done! Here's your extracted label information:"
    );
    await bot.sendDocument(chatId, FINAL_JSON);
  } catch (err) {
    console.error("❌ Failed to send JSON file to user:", err.message);
    await bot.sendMessage(
      chatId,
      "❌ Something went wrong while sending the result."
    );
  }

  // Optional: Clean up after sending
  // cleanUserFolders(userId);
};

module.exports = { handleSubmit };
