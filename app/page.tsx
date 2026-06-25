import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getAIDescription(repo: any) {
  let readme = "";
  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${repo.name}/readme`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.raw",
        },
      }
    );
    if (readmeRes.ok) readme = await readmeRes.text();
  } catch {}

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Write a clear and impressive 2-3 sentence portfolio description for this GitHub project.

Repository name: ${repo.name}
GitHub description: ${repo.description || "None"}
Primary language: ${repo.language || "Unknown"}
README preview: ${readme ? readme.slice(0, 500) : "Not available"}

Write only the description, nothing else.`,
      },
    ],
    max_tokens: 150,
  });

  return completion.choices[0]?.message?.content || repo.description || "A software project.";
}

export default async function Home() {
  const res = await fetch(
    `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
    {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      next: { revalidate: 3600 },
    }
  );

  const repos = await res.json();

  const reposWithAI = await Promise.all(
    repos.map(async (repo: any) => ({
      ...repo,
      aiDescription: await getAIDescription(repo),
    }))
  );

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "4px" }}>My Portfolio</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>⚡ Auto-synced from GitHub · AI-powered descriptions</p>

      <div style={{ display: "grid", gap: "20px" }}>
        {reposWithAI.map((repo: any) => (
          <div key={repo.id} style={{ border: "1px solid #222", borderRadius: "12px", padding: "24px", background: "#111" }}>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{repo.name}</h2>
            <p style={{ color: "#ccc", margin: "0 0 12px 0", lineHeight: "1.6" }}>{repo.aiDescription}</p>
            <p style={{ fontSize: "13px", color: "#444", margin: "0 0 16px 0" }}>
              ⭐ {repo.stargazers_count} &nbsp;·&nbsp; 🍴 {repo.forks_count} &nbsp;·&nbsp; {repo.language || "Unknown"}
            </p>
            <a href={repo.html_url} target="_blank" style={{ color: "#4f9eff", fontSize: "14px" }}>View on GitHub →</a>
          </div>
        ))}
      </div>
    </main>
  );
}