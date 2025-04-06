const handleStart = (msg, bot) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome! Use /information to upload your files."
  );
};

module.exports = { handleStart };
