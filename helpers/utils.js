const path = require("path");
const fs = require("fs");

function getUserPaths(userId) {
  const base = userId.toString();
  const DOWNLOADS_DIR = path.join(__dirname, "..", "downloads", base);
  const TEMP_DIR = path.join(__dirname, "..", "temp", base);
  const FINAL_JSON = path.join(__dirname, "..", "label-info", `${base}.json`);

  return { DOWNLOADS_DIR, TEMP_DIR, FINAL_JSON };
}

function ensureUserFolders(userId) {
  const { DOWNLOADS_DIR, TEMP_DIR } = getUserPaths(userId);
  [DOWNLOADS_DIR, TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function cleanUserFolders(userId) {
  const { DOWNLOADS_DIR, TEMP_DIR, FINAL_JSON } = getUserPaths(userId);
  [DOWNLOADS_DIR, TEMP_DIR].forEach((dir) => {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  });
  if (fs.existsSync(FINAL_JSON)) fs.unlinkSync(FINAL_JSON);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc" || ext === ".docx") return "application/msword";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  return "application/octet-stream";
}

module.exports = {
  getUserPaths,
  ensureUserFolders,
  cleanUserFolders,
  getMimeType,
};
