const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const { sendFormToGemini } = require("../helpers/sendFormToGemini"); // Ensure correct import
const { getMimeType } = require("../helpers/utilsForForm"); // Utility to check file MIME type

async function splitPDF(filePath, userId) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPages().length;

  const chunks = [];
  const userTempFolder = path.join(__dirname, "..", "temp", String(userId)); // Create user-specific temp folder

  if (!fs.existsSync(userTempFolder)) {
    fs.mkdirSync(userTempFolder, { recursive: true });
  }

  for (let i = 0; i < totalPages; i += 2) {
    const chunkDoc = await PDFDocument.create();
    const pagesToCopy = pdfDoc.getPages().slice(i, i + 2);
    for (const page of pagesToCopy) {
      const [copiedPage] = await chunkDoc.copyPages(pdfDoc, [
        pdfDoc.getPages().indexOf(page),
      ]);
      chunkDoc.addPage(copiedPage);
    }

    const chunkBytes = await chunkDoc.save();
    const chunkFilePath = path.join(userTempFolder, `chunk-${i / 2 + 1}.pdf`);
    fs.writeFileSync(chunkFilePath, chunkBytes);
    chunks.push(chunkFilePath);
  }

  return chunks;
}

const handleFormSubmit = async (msg, bot) => {
  const chatId = msg.chat.id;
  const userFolderPath = path.join(
    __dirname,
    "..",
    "form-downloads",
    String(chatId)
  );
  const userFormInfoFolder = path.join(
    __dirname,
    "..",
    "form-info",
    String(chatId)
  ); // User-specific folder under form-info

  // Ensure user-specific folder exists in form-info
  if (!fs.existsSync(userFormInfoFolder)) {
    fs.mkdirSync(userFormInfoFolder, { recursive: true });
  }

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

    const mimeType = getMimeType(filePath); // Check MIME type (PDF, image, DOC, text, etc.)
    if (mimeType === "application/pdf") {
      // For PDF files, split and process them in chunks
      const chunks = await splitPDF(filePath, chatId); // Pass userId as chatId
      const totalChunks = chunks.length;

      for (let i = 0; i < chunks.length; i++) {
        try {
          const chunkFilePath = chunks[i];
          const labelData = await sendFormToGemini(chunkFilePath);

          const tempLabelPath = path.join(
            __dirname,
            "..",
            "temp",
            String(chatId),
            `temp-${i + 1}-${chatId}-form-labels.txt`
          );
          fs.writeFileSync(tempLabelPath, labelData.result || labelData);

          results.push(
            `📄 Chunk ${i + 1} of ${fileName}:\n${
              labelData.result || labelData
            }`
          );

          await bot.sendMessage(
            chatId,
            `Processing chunk ${i + 1} of ${totalChunks} for ${fileName}...`
          );
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds between chunks
        } catch (err) {
          console.error(err);
          bot.sendMessage(
            chatId,
            `❌ Failed to process chunk ${i + 1} of ${fileName}`
          );
        }
      }
    } else if (
      mimeType.startsWith("image/") ||
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "text/plain"
    ) {
      // For image, DOC, DOCX, and text files, send them directly to Gemini
      try {
        const labelData = await sendFormToGemini(filePath);
        results.push(`📄 File: ${fileName}:\n${labelData.result || labelData}`);
        await bot.sendMessage(chatId, `Processing file: ${fileName}...`);
      } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `❌ Failed to process file: ${fileName}`);
      }
    } else {
      bot.sendMessage(chatId, `⚠️ Unsupported file type: ${fileName}`);
    }
  }

  // Save label text to a file named as per the original form file, inside the user-specific folder
  const outputFilePath = path.join(
    userFormInfoFolder,
    `${files[0].split(".")[0]}-labels.txt`
  );
  fs.writeFileSync(outputFilePath, results.join("\n\n"));
  bot.sendMessage(
    chatId,
    "✅ All forms processed. Label text saved successfully."
  );

  // Cleanup temporary files after processing
  const userTempFolder = path.join(__dirname, "..", "temp", String(chatId));
  if (fs.existsSync(userTempFolder)) {
    fs.rmSync(userTempFolder, { recursive: true, force: true });
    console.log(`Temp folder for user ${chatId} cleaned up.`);
  }

  // Remove form file from form-downloads folder after processing
  const userFormFolder = path.join(
    __dirname,
    "..",
    "form-downloads",
    String(chatId)
  );
  for (const fileName of files) {
    const formFilePath = path.join(userFormFolder, fileName);
    if (fs.existsSync(formFilePath)) {
      fs.unlinkSync(formFilePath); // Delete the form file
      console.log(`Form file ${fileName} deleted from form-downloads folder.`);
    }
  }

  // Remove the user folder from form-downloads if it's empty
  if (
    fs.existsSync(userFormFolder) &&
    fs.readdirSync(userFormFolder).length === 0
  ) {
    fs.rmdirSync(userFormFolder); // Remove the empty folder
    console.log(`Empty folder ${userFormFolder} deleted.`);
  }
};

module.exports = { handleFormSubmit };
