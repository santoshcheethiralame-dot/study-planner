# Daily Harmony Planner

A modern, logic-driven, and minimal **daily study planner** built for Indian engineering students.  
Built around **intelligent, mood-aware planning** with no fluff: the right structure for each day, personalized to your current state, upcoming exams, and workload—minus overwhelm or guilt.

---

## ✨ What's New

- **Google Stitch-inspired UI**: Card-based, super clean and focused.
- **Focus Timer**: In-app study timer with progress ring, focus/complete/exit controls, and browser notification/audio alert when a block is finished.
- **Responsive Timeline**: Daily plan is visualized as a timeline of blocks (study, assignments, classes).
- **Session Reasoning**: Every block comes with a clear, human-readable explanation.
- **Keyboard Shortcuts**: Quickly pause/start (Space) or exit (Esc) focus sessions.
- **Mood & Exam Context Inputs**: Specify how you feel and the current exam phase; the recommendations adapt live.
- **Early Completion**: End a study block early if you finish fast.
- **Persistent State (coming soon)**: Local session state by default, with reversible edits.
- **Separation of Concerns**: UI and planning logic ("planner engine") are strictly decoupled for easy upgrades and clarity.

---

## 🧠 Core Principles

* **Logic-first** (not calendar-first)
* **Daily, not weekly**: Plan only today, deeply. No streaks or guilt traps.
* **Mood & Recovery-Aware**: Inputs how you feel and whether you need easier days, heavier work, or catch up.
* **Exam/Assignment Sensitivity**: Weighs upcoming events and urgent deadlines automatically.
* **Transparent Reasoning**: Every block can explain "why" it exists.
* **Minimal, focused interface**: Fewer distractions, smooth on desktop/mobile.
* **Frontend owned by React/TypeScript**; logic module is a pure function returning a plan.

---

## 🖥️ Current Features

- Modern planner UI (Stitch-inspired)
- Mood toggle (low/normal/high) & exam phase selector (ISA/ESA/none)
- Real timeline layout
- Task blocks with labels, durations, and reasoning
- Interactive focus session per block with timer, pause/start/exit/complete
- Progress ring and % complete
- Clear distinction between urgent assignments, class catch-up, and planned study
- Desktop-first, mobile-adaptive design
- Keyboard shortcuts in timer sessions (Space/Pause, Esc/Exit)

---

## 🏗️ Architecture

Strict separation for clarity and modifiability:

```
UI (React/TypeScript)
│
├── Input Layer: Mood, Exam phase, etc.
├── Display Layer: Timeline, FocusSession, Card stacks
│
└── Planner Engine (standalone pure function)
    ├── Receives input values and context
    ├── Returns JSON plan (see below)
    └── Easily tested or replaced
```

Planner logic and UI are **decoupled**—making experimentation/extension simple.

---

## 🧩 Input Factors

- Mood: `low`, `normal`, `high`
- Exam Phase: `none`, `ISA`, `ESA`
- Urgent assignments (flagged on timeline)
- Bunked class catch-up
- Requests for "day off" or reduced capacity

---

## 🟩 Output Types

- Plan with **ordered session blocks** (study, assignment, class, catch-up)
- Duration and label per block
- Human explanation for every block
- Plan type: `light`, `normal`, or `heavy` day

**Example JSON output:**

```ts
generateDailyPlan(input) → {
  dailyLoad: "light" | "normal" | "heavy",
  plan: [
    {
      type: "study" | "assignment" | "class" | "catchup",
      label: string,
      duration: string,
      reason: string
    }
  ]
}
```

UI consumes only this plan!

---

## 🎨 UI Goals

- Calm and inviting (blue/neutral palette, generous space)
- Card-based, touch-friendly layout
- Priorities clear at a glance
- Minimal distractions (one-day view only)
- Inspired by [Notion](https://notion.so), [Linear](https://linear.app), and calm productivity tools

---

## 🛠️ Tech Stack

- **React** (functional components, hooks)
- **TypeScript** everywhere
- **TailwindCSS** + custom CSS vars for theme and system colours
- **Component-driven** (no monolithic files)
- **Planner engine** as a pure, separate module

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/daily-harmony-planner.git
cd daily-harmony-planner
npm install
npm run dev
```

---

## ⚡ Status (May 2024)

- ✅ Full UI rebuild in progress using Google Stitch + TailwindCSS
- ✅ Focus timer and in-app session logic complete
- ✅ Timeline plan generation: static demo; planner logic modularized
- 🛠 Mood/Exam contextualization: live, session-aware
- 🟡 Local state, undo/redo, and persistence—work in progress
- ⏳ Planner engine to be reintroduced with pure logic, follow-up after UI finalization

---

## 📍 Why This Matters

This is not a CRUD app.
It is not a generic task manager.

It’s a proof-of-concept for:

- Real-world reasoning in study planning
- Modularity and clean architecture
- Prioritizing UX, calm, and correctness over features
- Building for clarity—not dopamine or gamification

---

## 🧭 Roadmap

- [x] Google Stitch-based UI
- [x] Initial FocusSession (timer/progress/completion)
- [x] Mood & exam phase input integration
- [x] Modular planning logic interface (output as pure JSON)
- [ ] Live planner engine plug-in (<300 LOC, testable)
- [ ] Add recovery-intelligence in planning
- [ ] Keyboard nav & accessibility polish
- [ ] Real local/session storage
- [ ] Progressive enhancement/adaptive mobile layouts

---

## 👤 Author

Built by an engineering student for engineering students—  
with a focus on **clarity, calm, and real-world UX**.

Want to contribute? Issues and suggestions welcome!
