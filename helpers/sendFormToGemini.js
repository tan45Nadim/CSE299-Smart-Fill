const axios = require("axios");
const fs = require("fs");
const { getMimeType } = require("./utilsForForm");
const { extract } = require("../prompts/formExtraction");

async function sendFormToGemini(filePath, apiKey = process.env.GEMINI_API_KEY) {
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

  return { result: resultText };
}

module.exports = sendFormToGemini;
