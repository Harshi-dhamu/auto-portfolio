import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { repoName, description, language, readme } = await request.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are helping build a developer portfolio. Write a clear and impressive 2-3 sentence project description for the portfolio based on these details.

Repository name: ${repoName}
GitHub description: ${description || "None provided"}
Primary language: ${language || "Unknown"}
README preview: ${readme ? readme.slice(0, 500) : "Not available"}

Write only the description, nothing else.`,
      },
    ],
    max_tokens: 150,
  });

  const text = completion.choices[0]?.message?.content || "No description generated.";

  return Response.json({ description: text });
}