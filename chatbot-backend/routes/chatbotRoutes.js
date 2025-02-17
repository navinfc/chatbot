require("dotenv").config();
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

async function AiAPiCall(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Create a new chat screen
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const newChat = new Conversation({ userId, messages: [] });
    await newChat.save();
    res.status(201).json({ message: "New chat created", chat: newChat });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all chat screens of a user
router.get("/all-chats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Conversation.find({ userId });

    res.json({ chats });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get messages of a specific chat screen
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Conversation.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Send a message to a specific chat screen
router.post("/:chatId/send", authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { prompt } = req.body;

    const chat = await Conversation.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const response = await AiAPiCall(prompt);

    chat.messages.push({ prompt, response });
    await chat.save();

    res.status(201).json({ message: "Message saved", chat });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete all chat screens for a user
router.delete("/delete-all", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await Conversation.deleteMany({ userId });

    res.json({ message: "All chats deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a specific chat screen
router.delete("/:chatId/delete", authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    await Conversation.findByIdAndDelete(chatId);

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
