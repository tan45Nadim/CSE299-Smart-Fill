const axios = require("axios");
const fs = require("fs");
const { getMimeType } = require("./utils");
const { extract } = require("../prompts/extraction");

async function sendToGemini(filePath, apiKey) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString("base64");

  const body = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: getMimeType(filePath),
              data: base64Data,
            },
          },
          {
            text: ` ${extract} `,
          },
        ],
      },
    ],
  };

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    body,
    { headers: { "Content-Type": "application/json" } }
  );

  const resultText = response.data.candidates[0].content.parts[0].text;

  try {
    return JSON.parse(resultText);
  } catch {
    return { result: resultText };
  }
}

module.exports = { sendToGemini };
