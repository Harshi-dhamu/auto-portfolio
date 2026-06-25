import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── EDIT THESE ───────────────────────────────────────────
const ME = {
  name: "Harshikhaa Dass D",
  nameKatakana: "ハルシ・ダム",
  title: "Aspiring Penetration Tester & Cybersecurity Enthusiast",
  bio: "Cybersecurity enthusiast exploring penetration testing, cloud security, and secure software development.",
  location: "Chennai, India",
  email: "dhamuharshi@gmail.com",
  github: "https://github.com/Harshi-dhamu",
  linkedin: "www.linkedin.com/in/harshikhaa-dass09",
  skills: [
    { name: "Python", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "TypeScript", level: 75 },
    { name: "Next.js", level: 70 },
    { name: "React", level: 80 },
    { name: "Node.js", level: 65 },
    { name: "Git", level: 85 },
    { name: "AI / ML", level: 70 },
  ],
  experience: [
    {
      role: "CSE Student",
      company: "SRM Valliammai Engineering College",
      period: "2023 – 2027",
      desc: "B.E. CSE student passionate about ethical hacking, cybersecurity, and technology. Continuously learning, building projects, and working toward a career in offensive security.",
      tag: "Education",
    },
  ],
};
// ─────────────────────────────────────────────────────────

async function getAIDescription(repo: any) {
  let readme = "";
  try {
    const r = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${repo.name}/readme`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.raw",
        },
      }
    );
    if (r.ok) readme = await r.text();
  } catch {}
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Write a clear, impressive 2-sentence portfolio description for this GitHub project. Be specific about what it does and the tech it uses.

Repo: ${repo.name}
Description: ${repo.description || "none"}
Language: ${repo.language || "unknown"}
README: ${readme.slice(0, 400) || "none"}

Only output the 2-sentence description, nothing else.`,
        },
      ],
      max_tokens: 120,
    });
    return completion.choices[0]?.message?.content || repo.description || "A software project.";
  } catch {
    return repo.description || "A software project.";
  }
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #050508;
          --bg2: #0a0a10;
          --bg3: #0f0f18;
          --purple: #7c3aed;
          --purple-light: #a855f7;
          --cyan: #06b6d4;
          --pink: #ec4899;
          --text: #e2e8f0;
          --text-muted: #64748b;
          --text-dim: #334155;
          --glass: rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.08);
          --glass-hover: rgba(255,255,255,0.07);
          --glow-purple: 0 0 40px rgba(124,58,237,0.15);
          --glow-cyan: 0 0 40px rgba(6,182,212,0.15);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* ANIMATED BACKGROUND */
        .bg-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: float 20s infinite ease-in-out;
        }
        .orb-1 { width: 600px; height: 600px; background: var(--purple); top: -200px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; background: var(--cyan); top: 30%; right: -100px; animation-delay: -7s; }
        .orb-3 { width: 300px; height: 300px; background: var(--pink); bottom: 10%; left: 20%; animation-delay: -14s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-40px) scale(1.05); }
          66% { transform: translateY(20px) scale(0.97); }
        }

        /* GRID LINES BG */
        .grid-lines {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* LAYOUT */
        .page { position: relative; z-index: 1; }
        .container { max-width: 900px; margin: 0 auto; padding: 0 32px; }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 16px 48px;
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(5,5,8,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
        }
        .nav-logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: var(--purple-light);
          letter-spacing: 0.05em;
        }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
          font-family: 'JetBrains Mono', monospace;
        }
        .nav-links a:hover { color: var(--cyan); }

        /* SECTION */
        section { padding: 100px 0; }
        .section-inner { max-width: 900px; margin: 0 auto; padding: 0 32px; }

        .section-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--cyan);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-eyebrow::after {
          content: '';
          flex: 0 0 48px;
          height: 1px;
          background: var(--cyan);
          opacity: 0.4;
        }
        .section-title {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 48px;
        }

        /* GLASS CARD */
        .glass {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .glass:hover {
          background: var(--glass-hover);
          border-color: rgba(124,58,237,0.3);
          box-shadow: var(--glow-purple);
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          position: relative;
        }
        .hero-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.3);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--purple-light);
          margin-bottom: 32px;
          letter-spacing: 0.05em;
        }
        .hero-badge::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .hero-name {
          font-size: clamp(48px, 9vw, 88px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #fff;
          margin-bottom: 8px;
        }
        .hero-name span {
          background: linear-gradient(135deg, var(--purple-light), var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-katakana {
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 16px;
          color: var(--text-dim);
          letter-spacing: 0.2em;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: 20px;
          color: var(--text-muted);
          font-weight: 300;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        .hero-bio {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 480px;
          line-height: 1.75;
          margin-bottom: 48px;
        }
        .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn {
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: all 0.2s;
          cursor: pointer;
          display: inline-block;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          color: #fff;
          border: none;
          box-shadow: 0 0 24px rgba(124,58,237,0.4);
        }
        .btn-primary:hover { box-shadow: 0 0 40px rgba(124,58,237,0.6); transform: translateY(-1px); }
        .btn-outline {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--glass-border);
        }
        .btn-outline:hover { border-color: rgba(124,58,237,0.5); color: var(--purple-light); }

        /* FLOATING ANIME DECORATION */
        .anime-deco {
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          width: 340px;
          pointer-events: none;
          opacity: 0.15;
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 120px;
          font-weight: 700;
          color: var(--purple-light);
          line-height: 1;
          letter-spacing: -0.05em;
          user-select: none;
          text-align: right;
        }

        /* PROJECTS */
        .projects-grid { display: grid; gap: 16px; }
        .project-card {
          padding: 28px;
          cursor: default;
        }
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .project-name {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .project-lang-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 100px;
          background: rgba(6,182,212,0.1);
          border: 1px solid rgba(6,182,212,0.2);
          color: var(--cyan);
          white-space: nowrap;
        }
        .project-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .project-stats {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-dim);
          display: flex; gap: 16px;
        }
        .project-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--purple-light);
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .project-link:hover { color: var(--cyan); }

        /* SKILLS */
        .skills-grid { display: grid; gap: 16px; }
        .skill-row {
          display: grid;
          grid-template-columns: 140px 1fr 40px;
          align-items: center;
          gap: 16px;
        }
        .skill-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--text-muted);
        }
        .skill-bar-bg {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 100px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg, var(--purple), var(--cyan));
        }
        .skill-pct {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-dim);
          text-align: right;
        }

        /* EXPERIENCE */
        .exp-list { display: grid; gap: 24px; }
        .exp-card { padding: 28px; position: relative; overflow: hidden; }
        .exp-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, var(--purple), var(--cyan));
          border-radius: 0 2px 2px 0;
        }
        .exp-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--purple-light);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 10px;
          padding-left: 16px;
        }
        .exp-role {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          padding-left: 16px;
          margin-bottom: 4px;
        }
        .exp-company {
          font-size: 14px;
          color: var(--cyan);
          padding-left: 16px;
          margin-bottom: 4px;
        }
        .exp-period {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-dim);
          padding-left: 16px;
          margin-bottom: 14px;
        }
        .exp-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
          padding-left: 16px;
        }

        /* CONTACT */
        .contact-grid { display: grid; gap: 12px; }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 24px;
          text-decoration: none;
          color: inherit;
        }
        .contact-icon {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--purple-light);
          width: 90px;
          flex-shrink: 0;
          letter-spacing: 0.05em;
        }
        .contact-val {
          font-size: 14px;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .contact-item:hover .contact-val { color: var(--cyan); }
        .contact-arrow {
          margin-left: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-dim);
          transition: color 0.2s, transform 0.2s;
        }
        .contact-item:hover .contact-arrow { color: var(--cyan); transform: translateX(4px); }

        /* FOOTER */
        footer {
          text-align: center;
          padding: 48px 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          border-top: 1px solid var(--glass-border);
          position: relative; z-index: 1;
        }

        /* SCROLL INDICATOR */
        .scroll-hint {
          position: absolute;
          bottom: 40px; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.2em;
          animation: bounce 2s infinite;
        }
        .scroll-hint::after {
          content: '↓';
          font-size: 14px;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        /* JAPANESE VERTICAL TEXT */
        .jp-vertical {
          writing-mode: vertical-rl;
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 11px;
          color: var(--text-dim);
          letter-spacing: 0.2em;
          position: fixed;
          right: 24px; top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          pointer-events: none;
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="bg-canvas">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="grid-lines" />

      {/* JAPANESE SIDE TEXT */}
      <div className="jp-vertical">開発者 ポートフォリオ</div>

      <div className="page">
        {/* NAV */}
        <nav>
          <span className="nav-logo">~/portfolio</span>
          <div className="nav-links">
            <a href="#projects">projects</a>
            <a href="#skills">skills</a>
            <a href="#experience">exp</a>
            <a href="#contact">contact</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-inner" style={{ position: "relative" }}>
            <div className="anime-deco">開発<br />者</div>
            <div className="hero-badge">available for opportunities</div>
            <h1 className="hero-name">
              Hi, I'm<br />
              <span>{ME.name.split(" ")[0]}</span>.
            </h1>
            <p className="hero-katakana">{ME.nameKatakana}</p>
            <p className="hero-title">{ME.title}</p>
            <p className="hero-bio">{ME.bio}</p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href={ME.github} target="_blank" className="btn btn-outline">GitHub →</a>
            </div>
            <div className="scroll-hint">scroll</div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="section-inner">
            <p className="section-eyebrow">01 — work</p>
            <h2 className="section-title">Projects</h2>
            <div className="projects-grid">
              {reposWithAI.map((repo: any) => (
                <div key={repo.id} className="glass project-card">
                  <div className="project-header">
                    <span className="project-name">{repo.name}</span>
                    {repo.language && (
                      <span className="project-lang-badge">{repo.language}</span>
                    )}
                  </div>
                  <p className="project-desc">{repo.aiDescription}</p>
                  <div className="project-footer">
                    <div className="project-stats">
                      <span>★ {repo.stargazers_count}</span>
                      <span>⑂ {repo.forks_count}</span>
                    </div>
                    <a href={repo.html_url} target="_blank" className="project-link">
                      view source →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="section-inner">
            <p className="section-eyebrow">02 — tools</p>
            <h2 className="section-title">Skills</h2>
            <div className="glass" style={{ padding: "32px" }}>
              <div className="skills-grid">
                {ME.skills.map((skill) => (
                  <div key={skill.name} className="skill-row">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-bar-bg">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="skill-pct">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="section-inner">
            <p className="section-eyebrow">03 — background</p>
            <h2 className="section-title">Experience</h2>
            <div className="exp-list">
              {ME.experience.map((exp, i) => (
                <div key={i} className="glass exp-card">
                  <p className="exp-tag">{exp.tag}</p>
                  <p className="exp-role">{exp.role}</p>
                  <p className="exp-company">{exp.company}</p>
                  <p className="exp-period">{exp.period}</p>
                  <p className="exp-desc">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="section-inner">
            <p className="section-eyebrow">04 — reach out</p>
            <h2 className="section-title">Contact</h2>
            <div className="contact-grid">
              <a href={`mailto:${ME.email}`} className="glass contact-item">
                <span className="contact-icon">email://</span>
                <span className="contact-val">{ME.email}</span>
                <span className="contact-arrow">→</span>
              </a>
              <a href={ME.github} target="_blank" className="glass contact-item">
                <span className="contact-icon">github://</span>
                <span className="contact-val">{ME.github.replace("https://", "")}</span>
                <span className="contact-arrow">→</span>
              </a>
              <a href={ME.linkedin} target="_blank" className="glass contact-item">
                <span className="contact-icon">linkedin://</span>
                <span className="contact-val">{ME.linkedin.replace("https://", "")}</span>
                <span className="contact-arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        <footer>
          <p>
            built with next.js · groq ai · auto-synced from github ·{" "}
            {new Date().getFullYear()} · {ME.nameKatakana}
          </p>
        </footer>
      </div>
    </>
  );
}