# GitGlow 🌟

> **Illuminate Your GitHub Story** — A beautiful, open-source GitHub profile analyzer that transforms raw API data into stunning visual dashboards.

![GitGlow Preview](https://img.shields.io/badge/GitGlow-Live%20Demo-a855f7?style=for-the-badge&logo=github)
![GitHub](https://img.shields.io/badge/license-MIT-4ade80?style=for-the-badge)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?style=for-the-badge&logo=vercel)
![HTML CSS JS](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-f7df1e?style=for-the-badge)

---

## ✨ Features

- 🔍 **Instant Profile Search** — Enter any GitHub username and get results in seconds
- 📊 **Language Breakdown** — Beautiful animated donut chart of programming languages
- ⭐ **Top Repos by Stars** — Animated bar chart ranking most popular repositories
- 🃏 **Repository Cards** — Browse top 12 repositories with stars, forks, and language info
- ⚡ **Recent Activity Feed** — See the last 10 public events with readable descriptions
- 📈 **Stats Dashboard** — Total stars, forks, followers, repos, following, and gists
- 🎨 **Premium Dark UI** — Glassmorphism design with purple/cyan gradient theme
- 📱 **Fully Responsive** — Works perfectly on mobile, tablet, and desktop
- 🚀 **Zero Dependencies** — Pure HTML, CSS, JavaScript — no npm, no build step
- 🔒 **Privacy First** — No tracking, no data stored, no API keys required

---

## 🚀 Live Demo

👉 **[Try GitGlow →](https://gitglow-inky.vercel.app/)**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure |
| CSS3 | Glassmorphism styling, animations, responsive layout |
| Vanilla JavaScript | GitHub API integration, DOM manipulation, Canvas charts |
| GitHub Public API | User data, repos, and activity events |
| Google Fonts (Inter + JetBrains Mono) | Typography |
| Vercel | Static site hosting & deployment |

---

## 📦 Getting Started

GitGlow has **zero dependencies** and requires **no build step**. Just open it.

### Option 1 — Open Directly
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/gitglow.git
cd gitglow

# Open in browser
start index.html  # Windows
open index.html   # macOS
```

### Option 2 — Local Dev Server
```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .
```
Then visit `http://localhost:3000`

### Option 3 — Deploy to Vercel
```bash
npm i -g vercel
vercel deploy
```
Or simply drag the folder into [vercel.com/new](https://vercel.com/new) — it works instantly.

---

## 🗂️ Project Structure

```
gitglow/
├── index.html      # App structure & semantic HTML
├── style.css       # Full design system & animations
├── app.js          # GitHub API integration & rendering
├── vercel.json     # Vercel deployment config
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

---

## 🌐 API Usage

GitGlow uses the **GitHub Public REST API v3** — no authentication required.

| Endpoint | Purpose |
|---|---|
| `GET /users/{username}` | Profile info |
| `GET /users/{username}/repos` | All public repositories |
| `GET /users/{username}/events/public` | Recent public events |

> **Note:** Unauthenticated requests are limited to **60 requests/hour** per IP. If you hit the rate limit, wait a minute and try again.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#a855f7` (Purple) |
| Accent | `#22d3ee` (Cyan) |
| Background | `#080b14` (Deep Dark) |
| Glass | `rgba(255,255,255,0.04)` |
| Font | Inter + JetBrains Mono |

---

## 🗺️ Roadmap

- [ ] GitHub token support for higher rate limits
- [ ] Contribution graph visualization
- [ ] Shareable profile URLs (e.g. `/u/torvalds`)
- [ ] Compare two GitHub profiles side by side
- [ ] Dark/light theme toggle
- [ ] Export profile as PDF or PNG

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

Built with ❤️ and caffeine.

---

<p align="center">
  <strong>GitGlow</strong> — Made to illuminate your GitHub story ✦
</p>
