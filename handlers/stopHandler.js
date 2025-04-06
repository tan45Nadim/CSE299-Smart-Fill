const { cleanUserFolders } = require("../helpers/utils");

const handleStop = (msg, bot) => {
  const userId = msg.from.id;
  cleanUserFolders(userId);
  bot.sendMessage(
    msg.chat.id,
    "❎ Session stopped. All your files have been deleted."
  );
};

module.exports = { handleStop };
