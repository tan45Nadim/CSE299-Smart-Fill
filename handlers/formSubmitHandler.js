const path = require("path");
const fs = require("fs");
const sendFormToGemini = require("../helpers/sendFormToGemini");

const handleFormSubmit = async (msg, bot) => {
  const chatId = msg.chat.id;

  const userFolderPath = path.join(
    __dirname,
    "..",
    "form-downloads",
    String(chatId)
  );
  const outputPath = path.join(
    __dirname,
    "..",
    "form-info",
    `${chatId}-form-labels.txt`
  );

  if (!fs.existsSync(userFolderPath)) {
    return bot.sendMessage(
      chatId,
      "⚠️ No form found. Use /form to upload one first."
    );
  }

  const files = fs.readdirSync(userFolderPath);
  if (files.length === 0) {
    return bot.sendMessage(chatId, "⚠️ Your form folder is empty.");
  }

  const results = [];

  for (const fileName of files) {
    const filePath = path.join(userFolderPath, fileName);
    try {
      const labelData = await sendFormToGemini(filePath);
      results.push(`📄 File: ${fileName}\n${labelData.result || labelData}`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, `❌ Failed to process ${fileName}`);
    }
  }

  fs.writeFileSync(outputPath, results.join("\n\n"));
  bot.sendMessage(
    chatId,
    "✅ All forms processed. Label text saved successfully."
  );
};

module.exports = { handleFormSubmit };
