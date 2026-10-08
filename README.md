# VibeLearn 🧠

> **"Instead of asking students how they learn, VibeLearn learns how they actually learn."**

An adaptive AI study buddy built with **Next.js 14** + **Ollama** (100% local, no cloud API keys needed).

---

## ✨ Three Core Features

### 1. 🧠 Personal Learning Fingerprint
VibeLearn silently tracks engagement across every interaction — quick replies, experiment results, session length — and builds a **Learning Fingerprint** that updates in real time.

- Ranked activity types by actual engagement (not self-reported preference)
- Preferred session length
- Difficulty trajectory (Easy → Medium → Hard)
- Best recovery strategy when a student is struggling

Two students on the same topic get **completely different** learning experiences.

### 2. 🧪 Experiment Mode
Instead of giving the student the answer, VibeLearn lets them **predict → run → observe → understand**.

- Curio sends a `\`\`\`experiment\`\`\`` block with a code snippet + multiple choice options
- Student selects their prediction, then clicks **Run & Reveal**
- Result shown with colour-coded feedback, explanation, and a Socratic follow-up question
- Adapts to the student's fingerprint: struggling → simpler experiment; advanced → harder challenge

### 3. 📶 Offline / Low-Connectivity Mode
- Monitors Ollama availability every 15 seconds
- Switches to **Learning Continuity Mode** automatically when offline
- Queues questions and activities locally
- Banner shows pending sync count; one-click **Sync now** when back online

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [Ollama](https://ollama.com) installed and running

### 1. Pull a model
```bash
ollama pull llama3
```

### 2. Start Ollama
```bash
ollama serve
```

### 3. Clone & install
```bash
git clone https://github.com/samenthamassey127-hue/morphh
cd morphh
npm install
```

### 4. Configure (optional)
`.env.local` is pre-configured for Ollama defaults:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```
Change `OLLAMA_MODEL` to `mistral`, `phi3`, `gemma2`, etc. if you prefer.

### 5. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
morphh/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Ollama streaming chat endpoint
│   │   └── ollama-status/route.ts # Health check for connectivity banner
│   ├── layout.tsx
│   └── page.tsx                   # Root — wires all three features together
├── components/
│   ├── ChatWindow.tsx             # Main chat UI + fingerprint updates
│   ├── ConnectivityBanner.tsx     # Online/offline/no-ollama status bar
│   ├── ExperimentPanel.tsx        # Predict → Run → Reveal UI
│   ├── FingerprintCard.tsx        # Visual fingerprint display
│   ├── MessageBubble.tsx          # Renders text + embedded experiments
│   ├── QuickReplies.tsx           # Yes / Kind of / No feedback buttons
│   ├── SideBar.tsx                # Profile + fingerprint panel
│   └── ThemeToggle.tsx            # Dark/light mode toggle
└── lib/
    ├── prompt.ts                  # System prompt builder (fingerprint-aware)
    ├── storage.ts                 # Profile, fingerprint, offline queue
    ├── types.ts                   # All TypeScript types
    └── utils.ts                   # cn() utility
```

---

## 🔗 How the Three Features Connect

```
              VIBELEARN
                  │
                  ▼
          Personal Learning
             Fingerprint
                  │
          ┌───────┴────────┐
          ▼                ▼
   Experiment Mode    Normal Learning
          │                │
          └───────┬────────┘
                  ▼
             Performance
                  ▼
        Fingerprint Updated
                  │
                  ▼
        Better Recommendation
                  │
                  ▼
       Offline Mode if needed
                  │
                  ▼
            Sync Later
```

---

## 🏆 Challenge Alignment

| Challenge Requirement | VibeLearn Feature |
|---|---|
| Personalised adaptation | Learning Fingerprint (behaviour-derived) |
| Curiosity-driven engagement | Experiment Mode (predict → discover) |
| Infrastructure/connectivity constraints | Offline Mode + Sync |

---

*Built for students everywhere — with or without internet.*
