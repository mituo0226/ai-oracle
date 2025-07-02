import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // publicフォルダにdeep.htmlを置く

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/consult", async (req, res) => {
  const { question } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
あなたは霊能者「龍」です。
相談者に対し、守護神からの啓示を厳かに、かつ優しい口調で伝えます。
`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;
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
