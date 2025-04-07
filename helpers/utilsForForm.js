const fs = require("fs");
const path = require("path");

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
}

function cleanFormFolders(userId) {
  const base = userId.toString();
  const formDownloadPath = path.join(__dirname, "..", "form-downloads", base);
  const formInfoFolder = path.join(__dirname, "..", "form-info", base); // User-specific folder in form-info

  // 🧹 Delete folder: form-downloads/<userId>
  if (fs.existsSync(formDownloadPath)) {
    fs.rmSync(formDownloadPath, { recursive: true, force: true });
  }

  // 🧹 Delete user folder in form-info/<userId> (and all its contents)
  if (fs.existsSync(formInfoFolder)) {
    fs.rmSync(formInfoFolder, { recursive: true, force: true });
    // console.log(`User-specific folder ${formInfoFolder} deleted.`);
  }
}

module.exports = { getMimeType, cleanFormFolders };
