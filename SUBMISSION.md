# CoordiFlow AS-01 — Submission

## Problem
Kill the coordination black hole by making project changes visible, identifying impact, assigning stakeholders and actions, and preserving project memory.

## Core Workflow
Change → Impact Identification → Affected Stakeholders → Actions → Approval → Project Memory

## Included Features
- Coordination health dashboard
- Active change tracking
- Impact intelligence
- Stakeholder ownership
- Action/status tracking
- Project memory timeline
- Create a new change
- LocalStorage persistence for GitHub Pages
- Responsive UI
- Node.js + Express local server

## Live Deployment
This project is structured for GitHub Pages. Keep `index.html`, `style.css`, and `app.js` in the repository root.

GitHub Pages URL format:
`https://YOUR-USERNAME.github.io/coordiflow-as01/`

## Local Run
```bash
npm install
npm start
```
Then open `http://localhost:5000`.

## Tech Stack
HTML5, CSS3, JavaScript, Node.js, Express.js, LocalStorage.

## Submission Note
The static frontend is independent of the Express server, so it can run directly on GitHub Pages without MongoDB or a backend service.
