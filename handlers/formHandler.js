const fs = require("fs");
const path = require("path");

const handleForm = (msg, bot) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "📄 Please upload your form (PDF, DOC, or image). It will be saved under your form-downloads folder."
  );

  bot.once("document", async (docMsg) => {
    const fileId = docMsg.document.file_id;
    const fileName = docMsg.document.file_name;

    // Save to form-downloads/<user_id>/
    const userFolderPath = path.join(
      __dirname,
      "..",
      "form-downloads",
      String(chatId)
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    const filePath = path.join(userFolderPath, fileName);

    try {
      const fileUrl = await bot.getFileLink(fileId); // returns a direct URL
      const response = await fetch(fileUrl); // using native fetch (Node 20+)
      const buffer = await response.arrayBuffer();

      fs.writeFileSync(filePath, Buffer.from(buffer));
      bot.sendMessage(
        chatId,
        `✅ File *${fileName}* saved successfully. Use /submitForm to extract labels.`,
        { parse_mode: "Markdown" }
      );
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Failed to download and save the form.");
    }
  });
};

module.exports = { handleForm };
