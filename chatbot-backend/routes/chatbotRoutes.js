require("dotenv").config();
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Conversation = require('../models/Conversation');
// const { AiAPiCall } = require('../gemini/gemini');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();


async function AiAPiCall (prompt) {
  console.log("checking: ", prompt);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   const prompt = "Explain how AI works";

  const result = await model.generateContent(prompt);
//   console.log(result.response.text());
  return result.response.text();
};

module.exports = AiAPiCall;

// Save a conversation
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("chatbotRoutes.js file", prompt);
        const userId = req.user.id;

        let conversation = await Conversation.findOne({ userId });

        if (!conversation) {
            conversation = new Conversation({ userId, messages: [] });
        }

        console.log("ABOVE AICALL FUNCTION");
        const response = await AiAPiCall(prompt);

        conversation.messages.push({ prompt, response });
        await conversation.save();

        res.status(201).json({ message: 'Conversation saved successfully', conversation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all conversations of a user
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.findOne({ userId });

        if (!conversations) {
            return res.status(404).json({ message: 'No conversations found' });
        }

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a single message from conversation
router.delete('/delete/:messageId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;

        let conversation = await Conversation.findOne({ userId });
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        conversation.messages = conversation.messages.filter(msg => msg._id.toString() !== messageId);
        await conversation.save();

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete entire conversation
router.delete('/delete-all', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        await Conversation.findOneAndDelete({ userId });

        res.json({ message: 'Conversation cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;
