const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/chatHistory");
require("dotenv").config();

const router = express.Router();

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "User message is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([userMessage])
    // save in the database
    const chatHistory = new ChatHistory({ userMessage, botResponse: result.response.text() });
    await chatHistory.save();


    res.json({ userMessage, botResponse: result.response.text() });
  } catch (error) {
    console.error("Error generating response:", error.message);
    res.status(500).json({ error: "Failed to generate a response from the AI." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const chatHistory = await ChatHistory.find();
    res.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

module.exports = router;