# AayurFace — UX Specification: Dinacharya Routine & Habit Tracking
## Daily Ritual Scheduling, Optimistic Habit Completion & Thoughtful Consistency

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Routine & Habit Adherence  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Interaction Designer  

---

## 1. Timeline Layout & Time-of-Day Grouping

The `/routine` screen organizes daily Ayurvedic habits into 4 biological *Kala* (time-of-day) sections:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DINACHARYA DAILY SCHEDULE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🌅 PRATAH KALA (Morning: 06:00 – 10:00 — Kapha Time)                         │
│   [✓] Ushapan (Warm water hydration)                                  (Done)│
│   [✓] Rose water facial mist                                          (Done)│
│                                                                             │
│ ☀️ MADHYAHNA KALA (Midday: 10:00 – 14:00 — Pitta Time)                      │
│   [ ] Mindful Pitta-pacifying lunch (Cooling cucumber & cilantro)    (12:30)│
│                                                                             │
│ 🌇 SAYAM KALA (Evening: 18:00 – 22:00 — Vata Time)                          │
│   [ ] Sandalwood hydrating lepa (10 minutes)                         (20:00)│
│   [ ] Nasya or gentle facial massage with Kumkumadi oil              (21:30)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Optimistic Mutation & Thoughtful Consistency

* **Instant UI Check:** Clicking a habit checkbox immediately updates the local UI using TanStack Query `onMutate` optimistic updates.
* **Non-Toxic Streaks:** Rather than punishing users with dramatic streak breaks for missed days, the interface displays: *"You have completed 18 of your last 20 daily rituals (90% consistency). Your skin is responding well to regular care."*
