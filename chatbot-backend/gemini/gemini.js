require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function AiAPiCall (prompt) {
  console.log("checking: ", prompt);

//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// //   const prompt = "Explain how AI works";

//   const result = await model.generateContent(prompt);
//   console.log(result.response.text());
};

module.exports = AiAPiCall;
