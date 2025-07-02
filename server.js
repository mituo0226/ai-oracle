import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ここを追加: publicフォルダを静的ファイルとして公開する
app.use(express.static("public"));

// POSTのAPIは今まで通り
app.post("/api/consult", async (req, res) => {
  const { category, question } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `あなたは霊能者「龍」です。相談者の悩みに神の言葉を厳かに優しい口調で伝えます。`
        },
        {
          role: "user",
          content: `【相談ジャンル】
${category}

【相談内容】
${question}`
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;
    res.json({ result: answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI応答中にエラーが発生しました。" });
  }
});

// Render用にPORT環境変数を使う
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
