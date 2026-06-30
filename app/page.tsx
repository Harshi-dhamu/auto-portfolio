import { readFile } from "fs/promises";
import path from "path";
import Groq from "groq-sdk";
import Image from "next/image";
import Effects from "./effects";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ME = {
  name: "Harshi Dhamu",
  nameKatakana: "ハルシ・ダム",
  title: "CSE Student & Developer",
  bio: "I build AI-powered tools, cybersecurity utilities, and things that actually help people. Chennai, India.",
  location: "Chennai, India",
  email: "your@email.com",
  github: "https://github.com/Harshi-dhamu",
  linkedin: "https://linkedin.com/in/yourprofile",
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
      company: "Your College Name",
      period: "2022 – Present",
      desc: "Studying Computer Science and Engineering. Building projects in AI, web development, and cybersecurity.",
      tag: "Education",
    },
  ],
};

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
          content: `Write a clear, impressive 2-sentence portfolio description for this GitHub project. Be specific about what it does and what tech it uses.

Repo: ${repo.name}
Description: ${repo.description || "none"}
Language: ${repo.language || "unknown"}
README: ${readme.slice(0, 400) || "none"}

Only output the 2-sentence description.`,
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

  // Load LinkedIn data if available
  let linkedInData: any = null;
  try {
    const filePath = path.join(process.cwd(), "public", "linkedin-data.json");
    const raw = await readFile(filePath, "utf-8");
    linkedInData = JSON.parse(raw);
  } catch {}

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+JP:wght@300;700&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --bg:#02020a; --bg2:#07070f; --bg3:#0d0d1a;
          --purple:#7c3aed; --purple-l:#a855f7; --purple-ll:#c084fc;
          --cyan:#00ffc8; --pink:#ec4899;
          --text:#e2e8f0; --muted:#475569; --dim:#1e3a5f; --dimmer:#0f1f33;
          --glass:rgba(255,255,255,0.03); --glass-b:rgba(255,255,255,0.07);
          --glass-h:rgba(255,255,255,0.06);
        }
        html { scroll-behavior:smooth; }
        body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; overflow-x:hidden; line-height:1.6; }
        #neural-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
        .grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(124,58,237,0.025) 1px,transparent 1px), linear-gradient(90deg,rgba(124,58,237,0.025) 1px,transparent 1px);
          background-size:64px 64px; }
        .scanlines { position:fixed; inset:0; z-index:1; pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.015) 2px,rgba(0,0,0,0.015) 4px); }
        #cursor-glow { position:fixed; width:400px; height:400px; border-radius:50%;
          background:radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%);
          pointer-events:none; transform:translate(-50%,-50%); z-index:1; transition:opacity 0.3s; }
        .page { position:relative; z-index:2; }
        nav { position:fixed; top:0; left:0; right:0; z-index:100;
          padding:14px 48px; display:flex; justify-content:space-between; align-items:center;
          background:rgba(2,2,10,0.85); backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(0,255,200,0.08); }
        .nav-logo { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--cyan); letter-spacing:0.1em; }
        .nav-center { display:flex; gap:32px; }
        .nav-center a { color:var(--muted); text-decoration:none; font-size:12px; font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; transition:color 0.2s; }
        .nav-center a:hover { color:var(--cyan); }
        .nav-right { display:flex; align-items:center; gap:12px; }
        .nav-time { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--dim); }
        .nav-online { display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#22c55e; }
        .nav-online::before { content:''; width:5px; height:5px; border-radius:50%; background:#22c55e; box-shadow:0 0 6px #22c55e; animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        .hero { min-height:100vh; display:grid; grid-template-columns:1fr 500px; align-items:center; padding:80px 48px 0; max-width:1200px; margin:0 auto; gap:40px; }
        .hero-left { display:flex; flex-direction:column; gap:20px; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:100px; background:rgba(124,58,237,0.1); border:1px solid rgba(124,58,237,0.25); font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--purple-l); width:fit-content; letter-spacing:0.08em; }
        .hero-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:#22c55e; box-shadow:0 0 6px #22c55e; animation:pulse 2s infinite; }
        .hero-name { font-size:clamp(48px,7vw,80px); font-weight:700; letter-spacing:-0.04em; line-height:1.0; color:#fff; }
        .hero-name span { background:linear-gradient(135deg,var(--purple-l),var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-jp { font-family:'Noto Sans JP',sans-serif; font-size:13px; color:var(--dimmer); letter-spacing:0.35em; }
        .hero-title { font-size:18px; color:var(--muted); font-weight:300; letter-spacing:-0.01em; }
        .hero-bio { font-size:15px; color:var(--muted); line-height:1.75; max-width:420px; }
        .hero-btns { display:flex; gap:14px; flex-wrap:wrap; }
        .btn { padding:12px 28px; border-radius:10px; font-size:13px; font-weight:500; text-decoration:none; letter-spacing:0.02em; transition:all 0.2s; display:inline-block; cursor:pointer; border:none; font-family:'Inter',sans-serif; }
        .btn-primary { background:linear-gradient(135deg,var(--purple),var(--purple-l)); color:#fff; box-shadow:0 0 28px rgba(124,58,237,0.35); }
        .btn-primary:hover { box-shadow:0 0 44px rgba(124,58,237,0.55); transform:translateY(-2px); }
        .btn-outline { background:transparent; color:var(--text); border:1px solid var(--glass-b); }
        .btn-outline:hover { border-color:rgba(0,255,200,0.3); color:var(--cyan); }
        .hero-stats { display:flex; gap:32px; }
        .stat { display:flex; flex-direction:column; }
        .stat-num { font-size:28px; font-weight:700; color:#fff; font-family:'JetBrains Mono',monospace; }
        .stat-num span { color:var(--cyan); }
        .stat-label { font-size:11px; color:var(--dim); font-family:'JetBrains Mono',monospace; letter-spacing:0.1em; }
        .hero-right { position:relative; display:flex; align-items:flex-end; justify-content:center; height:600px; }
        .char-container { position:relative; width:460px; height:560px; }
        .char-img { width:100%; height:100%; object-fit:cover; object-position:top; border-radius:24px; position:relative; z-index:2;
          mask-image:linear-gradient(to bottom,black 60%,transparent 100%);
          -webkit-mask-image:linear-gradient(to bottom,black 60%,transparent 100%); }
        .char-glow { position:absolute; bottom:-20px; left:50%; transform:translateX(-50%);
          width:320px; height:120px; background:radial-gradient(ellipse,rgba(124,58,237,0.4) 0%,transparent 70%);
          border-radius:50%; filter:blur(20px); z-index:1; }
        .char-glow-top { position:absolute; top:10%; right:-20px; width:200px; height:200px;
          background:radial-gradient(circle,rgba(0,255,200,0.08) 0%,transparent 70%); z-index:1; }
        .float-tag { position:absolute; z-index:10; background:rgba(7,7,15,0.85); border:1px solid rgba(0,255,200,0.2);
          border-radius:10px; padding:8px 14px; font-family:'JetBrains Mono',monospace; font-size:11px;
          color:var(--cyan); backdrop-filter:blur(12px); white-space:nowrap; }
        .ft1 { top:60px; left:-60px; animation:float1 4s ease-in-out infinite; }
        .ft2 { top:180px; right:-70px; animation:float1 4s ease-in-out infinite; animation-delay:-2s; }
        .ft3 { bottom:120px; left:-80px; animation:float1 3.5s ease-in-out infinite; animation-delay:-1s; }
        .ft4 { bottom:60px; right:-60px; animation:float1 5s ease-in-out infinite; animation-delay:-3s; }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .ft-label { font-size:9px; color:var(--dim); margin-bottom:2px; letter-spacing:0.1em; }
        .ft-val { color:#fff; }
        .ft-val span { color:var(--cyan); }
        .corner-tl, .corner-br { position:absolute; width:28px; height:28px; z-index:3; }
        .corner-tl { top:12px; left:12px; border-top:2px solid rgba(0,255,200,0.4); border-left:2px solid rgba(0,255,200,0.4); border-radius:4px 0 0 0; }
        .corner-br { bottom:12px; right:12px; border-bottom:2px solid rgba(0,255,200,0.4); border-right:2px solid rgba(0,255,200,0.4); border-radius:0 0 4px 0; }
        section { padding:100px 48px; max-width:1100px; margin:0 auto; }
        .section-eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--cyan); letter-spacing:0.25em; text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:12px; opacity:0.8; }
        .section-eyebrow::after { content:''; flex:0 0 48px; height:1px; background:var(--cyan); opacity:0.3; }
        .section-title { font-size:38px; font-weight:700; letter-spacing:-0.03em; color:#fff; margin-bottom:48px; }
        .glass { background:var(--glass); border:1px solid var(--glass-b); border-radius:16px; backdrop-filter:blur(12px); transition:all 0.25s; }
        .glass:hover { background:var(--glass-h); border-color:rgba(124,58,237,0.3); box-shadow:0 0 40px rgba(124,58,237,0.1); }
        .projects-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .pcard { padding:28px; position:relative; overflow:hidden; }
        .pcard::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--purple),var(--cyan)); opacity:0; transition:opacity 0.3s; border-radius:16px 16px 0 0; }
        .pcard:hover::before { opacity:1; }
        .pcard-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
        .pcard-name { font-size:16px; font-weight:600; color:#fff; letter-spacing:-0.01em; }
        .pcard-lang { font-family:'JetBrains Mono',monospace; font-size:10px; padding:3px 10px; border-radius:100px; background:rgba(0,255,200,0.08); border:1px solid rgba(0,255,200,0.18); color:var(--cyan); }
        .pcard-desc { font-size:13px; color:var(--muted); line-height:1.7; margin-bottom:20px; }
        .pcard-footer { display:flex; justify-content:space-between; align-items:center; }
        .pcard-stats { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--dim); display:flex; gap:16px; }
        .pcard-link { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--purple-l); text-decoration:none; transition:color 0.2s; }
        .pcard-link:hover { color:var(--cyan); }
        .skills-wrap { padding:36px 40px; }
        .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .skill-row { display:grid; grid-template-columns:120px 1fr 36px; align-items:center; gap:14px; }
        .skill-name { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted); }
        .skill-track { height:3px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; }
        .skill-fill { height:100%; background:linear-gradient(90deg,var(--purple),var(--cyan)); border-radius:3px; }
        .skill-pct { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--dim); text-align:right; }
        .exp-grid { display:grid; gap:20px; }
        .exp-card { padding:32px; position:relative; overflow:hidden; }
        .exp-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:linear-gradient(180deg,var(--purple),var(--cyan)); border-radius:0 2px 2px 0; }
        .exp-tag { font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--purple-l); letter-spacing:0.2em; text-transform:uppercase; margin-bottom:10px; padding-left:20px; }
        .exp-role { font-size:18px; font-weight:600; color:#fff; padding-left:20px; margin-bottom:4px; }
        .exp-co { font-size:13px; color:var(--cyan); padding-left:20px; margin-bottom:4px; }
        .exp-period { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--dim); padding-left:20px; margin-bottom:12px; }
        .exp-desc { font-size:13px; color:var(--muted); line-height:1.7; padding-left:20px; }
        .contact-grid { display:grid; gap:12px; }
        .contact-item { display:flex; align-items:center; gap:20px; padding:20px 24px; text-decoration:none; color:inherit; }
        .ci-icon { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--purple-l); width:88px; flex-shrink:0; letter-spacing:0.05em; }
        .ci-val { font-size:14px; color:var(--muted); transition:color 0.2s; }
        .ci-arrow { margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--dim); transition:all 0.2s; }
        .contact-item:hover .ci-val { color:var(--cyan); }
        .contact-item:hover .ci-arrow { color:var(--cyan); transform:translateX(4px); }
        .jp-side { position:fixed; right:20px; top:50%; transform:translateY(-50%); writing-mode:vertical-rl; font-family:'Noto Sans JP',sans-serif; font-size:10px; color:var(--dimmer); letter-spacing:0.25em; z-index:10; pointer-events:none; }
        footer { text-align:center; padding:48px; font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--dim); border-top:1px solid var(--glass-b); letter-spacing:0.1em; position:relative; z-index:2; }
        .divider { border:none; border-top:1px solid rgba(255,255,255,0.04); max-width:1100px; margin:0 auto; }
        @media (max-width: 768px) {
          .hero { grid-template-columns:1fr; padding:100px 24px 40px; }
          .hero-right { display:none; }
          .projects-grid { grid-template-columns:1fr; }
          .skills-grid { grid-template-columns:1fr; }
          nav { padding:14px 24px; }
          .nav-center { display:none; }
          section { padding:80px 24px; }
        }
      `}</style>

      <canvas id="neural-canvas"></canvas>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>
      <div id="cursor-glow"></div>
      <div className="jp-side">開発者 · ポートフォリオ · {new Date().getFullYear()}</div>

      <div className="page">
        <nav>
          <span className="nav-logo">~/portfolio</span>
          <div className="nav-center">
            <a href="#projects">projects</a>
            <a href="#skills">skills</a>
            <a href="#experience">experience</a>
            <a href="#contact">contact</a>
          </div>
          <div className="nav-right">
            <span className="nav-time" id="nav-clock"></span>
            <span className="nav-online">online</span>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-left">
            <div className="hero-badge">available for opportunities</div>
            <h1 className="hero-name">
              Hi, I'm<br />
              <span>{ME.name.split(" ")[0]}</span>.
            </h1>
            <p className="hero-jp">{ME.nameKatakana} · 開発者</p>
            <p className="hero-title">{ME.title}</p>
            <p className="hero-bio">{ME.bio}</p>
            <div className="hero-btns">
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href={ME.github} target="_blank" className="btn btn-outline">GitHub →</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">{reposWithAI.length}<span>+</span></span>
                <span className="stat-label">PROJECTS</span>
              </div>
              <div className="stat">
                <span className="stat-num">{ME.skills.length}<span>+</span></span>
                <span className="stat-label">SKILLS</span>
              </div>
              <div className="stat">
                <span className="stat-num">1<span>k</span></span>
                <span className="stat-label">COMMITS</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="char-container">
              <div className="char-glow-top"></div>
              <Image
                src="/anime-char.jpg"
                alt="Developer character"
                width={460}
                height={560}
                className="char-img"
                priority
              />
              <div className="char-glow"></div>
              <div className="corner-tl"></div>
              <div className="corner-br"></div>

              <div className="float-tag ft1">
                <div className="ft-label">// STATUS</div>
                <div className="ft-val"><span>AI</span>_ACTIVE</div>
              </div>
              <div className="float-tag ft2">
                <div className="ft-label">// LATEST</div>
                <div className="ft-val">git push <span>✓</span></div>
              </div>
              <div className="float-tag ft3">
                <div className="ft-label">// STACK</div>
                <div className="ft-val">Next<span>.</span>js · Groq</div>
              </div>
              <div className="float-tag ft4">
                <div className="ft-label">// LOCATION</div>
                <div className="ft-val"><span>Chennai</span>, IN</div>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <section id="projects">
          <p className="section-eyebrow">01 — work</p>
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {reposWithAI.map((repo: any) => (
              <div key={repo.id} className="glass pcard">
                <div className="pcard-top">
                  <span className="pcard-name">{repo.name}</span>
                  {repo.language && <span className="pcard-lang">{repo.language}</span>}
                </div>
                <p className="pcard-desc">{repo.aiDescription}</p>
                <div className="pcard-footer">
                  <div className="pcard-stats">
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count}</span>
                  </div>
                  <a href={repo.html_url} target="_blank" className="pcard-link">view source →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        <section id="skills">
          <p className="section-eyebrow">02 — tools</p>
          <h2 className="section-title">Skills</h2>
          <div className="glass skills-wrap">
            <div className="skills-grid">
              {ME.skills.map((s) => (
                <div key={s.name} className="skill-row">
                  <span className="skill-name">{s.name}</span>
                  <div className="skill-track">
                    <div className="skill-fill" style={{ width: `${s.level}%` }} />
                  </div>
                  <span className="skill-pct">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section id="experience">
          <p className="section-eyebrow">03 — background</p>
          <h2 className="section-title">Experience</h2>
          <div className="exp-grid">

            {linkedInData?.experience?.length > 0 ? (
              linkedInData.experience.map((exp: any, i: number) => (
                <div key={i} className="glass exp-card">
                  <p className="exp-tag">Work · via LinkedIn</p>
                  <p className="exp-role">{exp.role}</p>
                  <p className="exp-co">{exp.company} {exp.location ? `· ${exp.location}` : ""}</p>
                  <p className="exp-period">{exp.startDate} – {exp.endDate}</p>
                  {exp.description && <p className="exp-desc">{exp.description}</p>}
                </div>
              ))
            ) : (
              ME.experience.map((exp, i) => (
                <div key={i} className="glass exp-card">
                  <p className="exp-tag">{exp.tag}</p>
                  <p className="exp-role">{exp.role}</p>
                  <p className="exp-co">{exp.company}</p>
                  <p className="exp-period">{exp.period}</p>
                  <p className="exp-desc">{exp.desc}</p>
                </div>
              ))
            )}

            {linkedInData?.education?.map((edu: any, i: number) => (
              <div key={`edu-${i}`} className="glass exp-card">
                <p className="exp-tag">Education · via LinkedIn</p>
                <p className="exp-role">{edu.degree || "Degree"}</p>
                <p className="exp-co">{edu.school}</p>
                <p className="exp-period">{edu.startDate} – {edu.endDate}</p>
                {edu.field && <p className="exp-desc">{edu.field}</p>}
              </div>
            ))}

          </div>

          {linkedInData?.skills?.length > 0 && (
            <div style={{marginTop: "32px"}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#00ffc8", letterSpacing:"0.2em", marginBottom:"16px"}}>
                // SKILLS VIA LINKEDIN
              </p>
              <div style={{display:"flex", flexWrap:"wrap", gap:"10px"}}>
                {linkedInData.skills.slice(0, 20).map((skill: string, i: number) => (
                  <span key={i} style={{fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", color:"#a855f7", background:"rgba(168,85,247,0.08)", border:"1px solid rgba(168,85,247,0.2)", padding:"6px 14px", borderRadius:"100px"}}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!linkedInData && (
            <div style={{marginTop:"32px", textAlign:"center"}}>
              <a href="/linkedin" style={{display:"inline-flex", alignItems:"center", gap:"8px", padding:"12px 28px", borderRadius:"10px", background:"rgba(10,102,194,0.1)", border:"1px solid rgba(10,102,194,0.3)", color:"#60a5fa", textDecoration:"none", fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", letterSpacing:"0.05em"}}>
                ⟳ Connect LinkedIn to auto-sync your experience
              </a>
            </div>
          )}
        </section>

        <hr className="divider" />

        <section id="contact">
          <p className="section-eyebrow">04 — reach out</p>
          <h2 className="section-title">Contact</h2>
          <div className="contact-grid">
            <a href={`mailto:${ME.email}`} className="glass contact-item">
              <span className="ci-icon">email://</span>
              <span className="ci-val">{ME.email}</span>
              <span className="ci-arrow">→</span>
            </a>
            <a href={ME.github} target="_blank" className="glass contact-item">
              <span className="ci-icon">github://</span>
              <span className="ci-val">{ME.github.replace("https://", "")}</span>
              <span className="ci-arrow">→</span>
            </a>
            <a href={ME.linkedin} target="_blank" className="glass contact-item">
              <span className="ci-icon">linkedin://</span>
              <span className="ci-val">{ME.linkedin.replace("https://", "")}</span>
              <span className="ci-arrow">→</span>
            </a>
          </div>
        </section>

        <footer>
          <p>built with next.js · groq ai · auto-synced from github · {ME.nameKatakana} · {new Date().getFullYear()}</p>
        </footer>
      </div>

      <Effects />
    </>
  );
}