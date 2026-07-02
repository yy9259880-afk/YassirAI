import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API موجود:", !!process.env.OPENAI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    res.json({
      reply: response.output_text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "حدث خطأ في الاتصال بالذكاء الاصطناعي."
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});