async function getAIDescription(repo: any) {
  // Fetch README
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
    if (readmeRes.ok) {
      readme = await readmeRes.text();
    }
  } catch {}

  // Call our AI route
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/describe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repoName: repo.name,
      description: repo.description,
      language: repo.language,
      readme,
    }),
  });

  const data = await res.json();
  return data.description;
}

export default async function Home() {
  const res = await fetch(
    `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  const repos = await res.json();

  // Get AI descriptions for all repos in parallel
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
          <div
            key={repo.id}
            style={{
              border: "1px solid #222",
              borderRadius: "12px",
              padding: "24px",
              background: "#111",
            }}
          >
            <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{repo.name}</h2>

            {/* AI Description */}
            <p style={{ color: "#ccc", margin: "0 0 8px 0", lineHeight: "1.6" }}>
              {repo.aiDescription}
            </p>

            {/* Original GitHub description in smaller text */}
            {repo.description && (
              <p style={{ color: "#555", fontSize: "13px", margin: "0 0 12px 0" }}>
                GitHub: {repo.description}
              </p>
            )}

            <p style={{ fontSize: "13px", color: "#444", margin: "0 0 16px 0" }}>
              ⭐ {repo.stargazers_count} &nbsp;·&nbsp; 🍴 {repo.forks_count} &nbsp;·&nbsp; {repo.language || "Unknown"}
            </p>

            <a href={repo.html_url} target="_blank" style={{ color: "#4f9eff", fontSize: "14px" }}>
              View on GitHub →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}