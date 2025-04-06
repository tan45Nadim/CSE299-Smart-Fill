const { cleanUserFolders } = require("../helpers/utils");
const { cleanFormFolders } = require("../helpers/utilsForForm");

const handleStop = (msg, bot) => {
  const userId = msg.from.id;

  cleanUserFolders(userId); // 🧹 deletes from /downloads & /temp
  cleanFormFolders(userId); // 🧹 deletes from /form-downloads & /form-info

  bot.sendMessage(
    msg.chat.id,
    "❎ Session stopped. All your files (form and info) have been deleted."
  );
};

module.exports = { handleStop };
