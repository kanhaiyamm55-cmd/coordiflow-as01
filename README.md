# CoordiFlow — AS-01

## Kill the coordination black hole nightmare

A complete, GitHub Pages-ready frontend MVP for the CoordiFlow AS-01 assignment.

### What is included
- Responsive dashboard / landing experience
- Change intelligence board
- Impact intelligence panel
- Stakeholder and ownership view
- Project-memory timeline
- Create Change form with validation
- LocalStorage persistence so newly-created changes remain after refresh
- Demo data loader
- Responsive mobile/tablet/desktop UI
- No external assets or build step required
- `public/` structure plus root copies for simple GitHub Pages deployment
- Optional Express server for local Node.js running

### Core workflow
**Change → Impact Identification → Affected Stakeholders → Actions/Approval → Project Memory**

### Run locally with Node
```bash
npm install
npm start
```
Open `http://localhost:5000`.

### Run without Node
Open `index.html` directly in a browser, or use VS Code Live Server.

### GitHub Pages deployment
1. Create a **public** repository, for example `coordiflow-as01`.
2. Upload the files from this ZIP to the repository root.
3. Keep `index.html`, `style.css`, and `app.js` at the root. The `public/` folder is also included for the Node/Express version.
4. GitHub → **Settings → Pages** → **Deploy from a branch** → `main` → `/ (root)` → Save.
5. Wait for deployment. Your URL will look like:
   `https://YOUR-USERNAME.github.io/coordiflow-as01/`

### Important
GitHub Pages runs the static frontend only. The optional `server.js` is for local Node/Express hosting; MongoDB/backend services are not required for this GitHub Pages demo.

### Files
- `index.html` — GitHub Pages entry point
- `style.css` — complete responsive design
- `app.js` — interactions and LocalStorage demo data
- `public/` — same frontend files for Express
- `server.js` — optional Express server
- `package.json` — Node dependency/script
