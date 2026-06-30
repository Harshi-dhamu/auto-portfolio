# 🌐 Auto Portfolio

A self-updating developer portfolio that automatically syncs with your GitHub repositories and LinkedIn profile — no manual updates ever needed.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-7c3aed?style=flat)
![License](https://img.shields.io/badge/license-MIT-00ffc8)

---

## 📋 Table of Contents

| Section | Description |
|---|---|
| [Features](#-features) | What this project does |
| [Tech Stack](#-tech-stack) | Technologies used |
| [AI Provider Options](#-ai-provider-options) | Choosing your AI backend |
| [Getting Started](#-getting-started) | Installation & setup |
| [Environment Variables](#-environment-variables) | Required config |
| [Deploy](#-deploy) | One-click deployment |
| [Connecting LinkedIn](#-connecting-linkedin) | LinkedIn sync setup |
| [Project Structure](#-project-structure) | File organization |
| [Contributing](#-contributing) | How to contribute |
| [License](#-license) | MIT License |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔄 GitHub Auto-Sync | Push a new repo, your portfolio updates automatically on next visit |
| 🤖 AI Project Descriptions | AI reads your README and writes a clean, professional summary |
| 💼 LinkedIn Sync | Upload your LinkedIn data export — experience, education, and skills populate instantly |
| 🎨 Cyberpunk Design | Glassmorphism UI, animated particle network, glowing accents, custom hero art |
| ⚡ Zero Maintenance | Built once, stays current forever — no manual edits required |
| 🆓 Free to Run | Every required service has a generous free tier |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| AI Engine | Groq API (Llama 3.3 70B) — swappable, see below |
| Data Source — Projects | GitHub REST API |
| Data Source — Experience | LinkedIn data export (CSV inside ZIP) |
| Styling | Custom CSS, glassmorphism, canvas-based particle animation |
| Deployment | Vercel |
| File Parsing | JSZip (for LinkedIn ZIP uploads) |

---

## 🤖 AI Provider Options

This project uses **Groq (Llama 3.3 70B)** by default. You can swap in any alternative by editing `getAIDescription()` in `app/page.tsx`.

| Provider | Free Tier | Cost After Free Tier | Speed | Best For |
|---|---|---|---|---|
| **[Groq](https://console.groq.com)** ⭐ Default | ✅ Yes, no card needed | Pay-as-you-go | ⚡⚡⚡ Fastest | Best overall — free + fast + zero friction |
| **[Google Gemini](https://aistudio.google.com)** | ✅ Yes | Pay-as-you-go | ⚡⚡ Fast | Good if already using Google Cloud |
| **[OpenAI](https://platform.openai.com)** | ⚠️ Trial credits only | Pay-as-you-go | ⚡⚡ Fast | Best output quality, most widely supported |
| **[Anthropic Claude](https://console.anthropic.com)** | ⚠️ $5 credit on signup | Pay-as-you-go | ⚡⚡ Fast | Best at understanding nuanced READMEs |
| **[Ollama](https://ollama.com)** (self-hosted) | ✅ 100% free forever | None — runs locally | ⚡ Depends on hardware | Privacy, offline use, no API limits |
| **[Mistral AI](https://console.mistral.ai)** | ✅ Yes | Pay-as-you-go | ⚡⚡ Fast | Lightweight European alternative |

### Why Groq is the default

| Reason | Detail |
|---|---|
| No card required | Sign up and get an API key in under a minute |
| Fastest inference | Often responds in well under a second |
| Generous limits | Free tier handles hundreds of repo description generations |
| Open-weight model | Llama 3.3 70B — strong at short, structured writing tasks |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Where to get it |
|---|---|
| Node.js 18+ | [nodejs.org](https://nodejs.org) |
| GitHub Personal Access Token | [github.com/settings/tokens](https://github.com/settings/tokens) — scope: `public_repo` |
| Groq API Key (free) | [console.groq.com](https://console.groq.com) |

### Installation

```bash
git clone https://github.com/Harshi-dhamu/auto-portfolio.git
cd auto-portfolio
npm install
```

### Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

| Variable | Description | Required |
|---|---|---|
| `GITHUB_TOKEN` | Personal access token with `public_repo` scope | ✅ Yes |
| `GITHUB_USERNAME` | Your GitHub username | ✅ Yes |
| `GROQ_API_KEY` | Free API key from Groq Console | ✅ Yes |

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
GROQ_API_KEY=your_groq_api_key
```

> ⚠️ `.env.local` is git-ignored by default — never commit real keys.

---

## 📦 Deploy

| Step | Action |
|---|---|
| 1 | Push your repo to GitHub |
| 2 | Go to [vercel.com](https://vercel.com) → Sign up with GitHub |
| 3 | Import your repo → add the 3 environment variables above |
| 4 | Click Deploy |

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harshi-dhamu/auto-portfolio)

---

## 🔗 Connecting LinkedIn

| Step | Action |
|---|---|
| 1 | Visit `/linkedin` on your deployed site |
| 2 | Go to [LinkedIn Data Export Settings](https://www.linkedin.com/mypreferences/d/download-my-data) |
| 3 | Select **"Download larger data archive"** → Request archive |
| 4 | Wait for LinkedIn's email (usually under 10 minutes) |
| 5 | Download the ZIP and upload it on the `/linkedin` page |
| 6 | Experience, education, and skills sync automatically — no API keys needed |

This uses LinkedIn's **official data export tool**, so it's fully compliant — you're only downloading and using your own data.

---

## 📁 Project Structure

| Path | Purpose |
|---|---|
| `app/page.tsx` | Main portfolio page — fetches GitHub repos, generates AI descriptions, renders UI |
| `app/effects.tsx` | Client-side animations — particle network, cursor glow, live clock |
| `app/linkedin/page.tsx` | LinkedIn ZIP upload interface |
| `app/api/linkedin/parse/route.ts` | Parses LinkedIn ZIP and saves structured JSON |
| `public/linkedin-data.json` | Generated after LinkedIn sync — holds parsed experience/education/skills |
| `public/anime-char.jpg` | Hero section character art |
| `.env.local` | Your private API keys (never committed) |

---

## 🤝 Contributing

| Step | Command |
|---|---|
| 1. Fork the repo | — |
| 2. Create a feature branch | `git checkout -b feature/amazing-feature` |
| 3. Commit your changes | `git commit -m "Add amazing feature"` |
| 4. Push to your branch | `git push origin feature/amazing-feature` |
| 5. Open a Pull Request | — |

Contributions, issues, and feature requests are all welcome!

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for full text.

---

## 👤 Author

| | |
|---|---|
| **Name** | Harshikhaa Dass |
| **GitHub** | [@Harshi-dhamu](https://github.com/Harshi-dhamu) |
| **LinkedIn** | [Harshikhaa Dass](www.linkedin.com/in/harshikhaa-dass09) |

---

⭐ If this helped you build your portfolio, consider giving it a star!