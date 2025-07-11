# 🛠️ Hackathonia

A full-stack web application for managing and reviewing Web3 projects submitted through the Hackathonia platform.

---

## 🧱 Project Structure

```
.
├── clientv2/        # Frontend (Next.js + TypeScript)
├── server/          # Backend (Node.js + Express)
├── .papi/           # Project API files (if any)
├── hackathonia/     # Ink! project folder (mock data, admin constants, etc.)
```

---

## 🚀 Getting Started

### 🖥️ Client (Frontend)

**Tech Stack:** Next.js, TypeScript, Tailwind CSS

```bash
cd clientv2
npm install
npm run dev
```

Runs the frontend on `http://localhost:3000`.

---

### 🔌 Server (Backend)

**Tech Stack:** Node.js, Express, Nodemon

```bash
cd server
npm install
npx nodemon app.js
```

Runs the backend on `http://localhost:2000` (or the configured port).

---

## 📦 Scripts

| Command                   | Description                  |
|---------------------------|------------------------------|
| `npm run dev` (client)    | Starts the Next.js frontend  |
| `nodemon app.js` (server) | Starts backend with hot reload |

