# VibeLearn — Adaptive AI Study Buddy 🚀

VibeLearn is an adaptive AI study buddy built for students in Grades 6–12. It customizes explanation depths, analogies, and interactive challenges based on the student's grade, selected academic track, enrolled courses, learning style, and mood.

---

## 🌟 Key Features

1. **Adaptive System Prompting**: Dynamically adjusts language complexity (Grade 6–8 simple analogies vs Grade 11–12 rigorous formulas).
2. **Mood Overrides**: 
   - **Bored**: Turns responses into a 2-minute quest or micro-challenge.
   - **Confused**: Provides 1 intuitive analogy + 1 simple worked example.
   - **Curious**: Offers advanced "What If?" deep dives.
   - **Tired**: Gives ultra-short explanations + 30-second break tips.
3. **Quick-Reply Feedback Loop**: `Yes`, `Kind of`, `No` buttons for immediate learning adjustments.
4. **Local Profile Persistence**: Saves user profile state in `localStorage`.
5. **Dark & Light Mode**: Built using `next-themes` with tailored Tailwind tokens.
6. **Streaming Chat**: Real-time response streaming powered by `@google/generative-ai` (`gemini-2.0-flash`).

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Theme**: `next-themes`
- **Icons**: `lucide-react`
- **AI SDK**: `@google/generative-ai`
- **Deployment**: Vercel

---

## 🔑 How to Get a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **"Get API Key"** -> **"Create API Key in new project"**.
4. Copy the API key.

---

## ⚙️ Setup & Local Running Instructions

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/curio-ai-study-buddy.git](https://github.com/your-username/curio-ai-study-buddy.git)
   cd curio-ai-study-buddy
