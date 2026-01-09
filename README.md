# Daily Harmony Planner

A logic-driven, calm, and minimal **daily study planner** designed for Indian engineering students.
The project focuses on **intelligent day planning** based on mood, exam phase, workload, and recovery needs — without overwhelming the user.

This repository currently prioritizes **frontend experience and UX clarity**, with backend/planner logic designed to be plugged in modularly.

---

## ✨ Project Vision

Most student planners fail because they:

* Over-plan
* Ignore mental state
* Treat all days equally
* Focus on weekly schedules instead of *today*

**Daily Harmony Planner** answers one question only:

> *“Given how I feel today, what is the best possible study plan for today?”*

---

## 🧠 Core Principles

* **Logic-first planning** (not calendar-first)
* **Mood-aware workload**
* **Exam-sensitive prioritization (ISA / ESA)**
* **Recovery-aware scheduling**
* **Minimal, distraction-free UI**
* **One-day focus only**

No streaks.
No gamification.
No guilt.

---

## 🖥️ Current Scope (Phase 1)

### Frontend (Primary Focus)

* Clean, modern planner UI
* Mood & exam phase input
* Daily plan visualization
* Timeline-based layout
* Clear reasoning for each task

### Backend / Logic

* Intentionally **decoupled**
* Planner engine will be plugged in later
* Designed as a pure function returning JSON

---

## 🧩 Key Features (Planned & In Progress)

### Input Factors

* Mood: `low | normal | high`
* Exam Phase: `none | ISA | ESA`
* Urgent assignments
* Bunked class recovery
* Day off handling

### Output

* Structured daily plan
* Study / assignment / class blocks
* Duration per block
* Reason for each block
* Light / normal / heavy day classification

---

## 🧱 Architecture Philosophy

This project follows **strict separation of concerns**:

```
UI (React)
│
├── Input Layer (Mood, Exam Phase, Toggles)
├── Display Layer (Timeline, Cards, Summary)
│
└── Planner Engine (Pure Logic – later)
    ├── Capacity calculation
    ├── Study prioritization
    ├── Exam relevance
    └── Recovery handling
```

Frontend and planner logic **do not depend on each other**.

---

## 🎨 UI Design Goals

* Calm and focused
* Minimal color palette
* Card-based layout
* Clear hierarchy
* Desktop-first, mobile-friendly
* Inspired by tools like:

  * Notion
  * Linear
  * Calm productivity apps

---

## 🛠️ Tech Stack

### Current

* React
* TypeScript
* Modern CSS / utility-first styling
* Component-driven architecture

### Planned

* Planner engine as a standalone module
* Optional persistence (localStorage)
* Optional analytics (non-invasive)

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/daily-harmony-planner.git
cd daily-harmony-planner
npm install
npm run dev
```

---

## 📦 Data Flow (Planned)

```ts
generateDailyPlan(input) → {
  dailyLoad: "light" | "normal" | "heavy",
  plan: [
    {
      type: "study" | "assignment" | "class",
      label: string,
      duration: string,
      reason: string
    }
  ]
}
```

The UI **only consumes this output**.

---

## 🧪 Status

* ✅ Project reset completed
* ✅ Frontend-first rebuild started
* 🟡 UI exploration using Google Stitch
* ⏳ Planner logic to be reintroduced cleanly

---

## 📌 Why This Project Matters

This is not a CRUD app.
This is not a generic planner.

This project demonstrates:

* System design thinking
* UX empathy
* Modular architecture
* Real-world problem solving
* Discipline in avoiding overengineering

---

## 🧭 Roadmap (High Level)

* [ ] Finalize UI structure
* [ ] Implement static planner mock
* [ ] Reintroduce planner engine (clean, <300 LOC)
* [ ] Add recovery intelligence
* [ ] Polish UX & accessibility
* [ ] Optional deployment

---

## 🧑‍💻 Author

Built by an engineering student for engineering students —
with a strong focus on **clarity, calm, and correctness**.
