# CoordiFlow — AS-01 Coordination Intelligence System

## 1. Problem
Architecture, interior design and construction projects involve many stakeholders and handoffs. Information is spread across chats, email, calls, drawings and spreadsheets. A project change can therefore affect multiple people and activities without everyone knowing.

## 2. Intervention
CoordiFlow creates one coordination layer connecting:
- stakeholders and responsibilities
- project activities
- changes
- potential impacts
- dependencies/actions
- approvals
- project memory

The key workflow is:

**Record a change → identify potential impact → identify responsible people → create actions → track completion → preserve project memory.**

## 3. Realistic scenario
A residential Modern Villa project has a client, architect, interior designer, electrical engineer, plumbing engineer and contractor. The client changes the master bathroom layout. CoordiFlow identifies likely impacts on floor plan, plumbing, electrical, tile schedule and procurement, then creates review actions for relevant stakeholders.

## 4. Intelligence capability
The prototype contains a transparent rule-based impact engine. It maps change language such as bathroom, kitchen, sink, bedroom, electrical, tile or material to likely project disciplines and deliverables.

AI/ML is optional in the brief. This MVP deliberately keeps the reasoning explainable. A future version can replace/augment the rules with an LLM while retaining human approval.

## 5. Architecture
Browser UI (HTML/CSS/JS)
        ↓
Express REST API
        ↓
MongoDB / demo memory fallback

### API
- GET `/api/dashboard`
- GET/POST `/api/stakeholders`
- GET/POST `/api/changes`
- GET/PATCH `/api/actions/:id`
- GET `/api/activities`
- GET `/api/impact/:id`
- GET `/api/health`

## 6. Data model
Stakeholder: name, role, responsibility, status

Change: title, description, creator, priority, impacts, affected stakeholders, affected tasks, approvals

Action: title, assignee, priority, status, due date, source change

Activity: message, actor, type, timestamp

## 7. What AI helped with
AI was used as a development assistant for brainstorming the workflow, generating/refining UI and backend boilerplate, reviewing edge cases and improving documentation. The submitted logic is understood by the builder and is intentionally explainable.

## 8. What broke / what we learned
The prototype includes a MongoDB fallback so the demo can still run when a local database is unavailable. For production, persistent MongoDB is required.

## 9. Next improvements
- LLM-assisted impact extraction from real project conversations
- dependency graph visualization
- email/WhatsApp ingestion
- file/version awareness
- role-based permissions
- notifications
- approval gates that automatically block dependent actions
- audit log and production authentication

## 10. Run locally

1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Start MongoDB locally, or set `MONGODB_URI` to a MongoDB Atlas connection string.
5. Run `npm start`.
6. Open `http://localhost:5000`.

If MongoDB is unavailable, the application starts in demo memory mode so the workflow can still be demonstrated. Data in demo mode resets when the server restarts.

## Hackathon submission checklist
- [ ] GitHub repository
- [ ] Deployed URL
- [ ] 3–5 minute walkthrough
- [ ] Documentation
- [ ] Demonstrate one complete intelligent workflow
