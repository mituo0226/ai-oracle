import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

// .envからAPIキーを読み込む
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// publicフォルダを静的配信
app.use(express.static("public"));

app.post("/api/consult", async (req, res) => {
  const { category, question } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // 品質重視モデル
      messages: [
        {
          role: "system",
          content: `
あなたは守護神と交信する霊能者「龍」です。
相談者の悩みに深く寄り添い、神秘的で厳かかつ優しい口調で語りかけます。
霊視によるイメージ（光・色・炎・波動など）を交え、
相談内容に対する具体的な助言も行います。
文章は800文字以上1000文字以内にし、
段落を分けて読みやすく構成してください。
`
        },
        {
          role: "user",
          content: `
【相談ジャンル】
${category}

【相談内容】
${question}
`
        }
      ],
      max_tokens: 1200, // 文字数を多めに確保
      temperature: 0.75
    });

    const answer = completion.choices[0].message.content.trim();
    res.json({ result: answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI応答中にエラーが発生しました。" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
