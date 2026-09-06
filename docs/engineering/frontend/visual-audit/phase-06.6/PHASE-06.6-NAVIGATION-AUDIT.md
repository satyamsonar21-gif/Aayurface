# AayurFace — Phase 06.6 Navigation Audit
## Forensic Architecture Review of Authenticated Desktop and Mobile Navigation

---

### 1. Conceptual Navigation Architecture

Phase 06.6 mandates a 9-item authenticated navigation structure grouped into three distinct conceptual tiers.

```
├── PRIMARY
│   ├── Home                 (/home)
│   ├── Scan Skin            (/scan)
│   └── Chat with Ayurveda   (/chat)
├── JOURNEY
│   ├── My History           (/history)
│   ├── Remedies             (/library)
│   ├── Daily Routine        (/routine)
│   └── Progress             (/progress)
└── ACCOUNT
    ├── Profile              (/profile)
    └── Settings             (/settings)
```

---

### 2. Route Mapping & Backend Boundary Verification

| Nav Label | Target Path | Registered Component | Component Mode | Backend API Invented? |
|---|---|---|---|---|
| **Home** | `/home` | `HomePage.tsx` | Active Reconstructed | No |
| **Scan Skin** | `/scan` | `ScanPage.tsx` | Active Reconstructed | No |
| **Chat with Ayurveda** | `/chat` | `ChatPage.tsx` | Active Product Screen | No |
| **My History** | `/history` | `HistoryPage.tsx` | **New Presentation Shell** | **No** (Local Mock Data) |
| **Remedies** | `/library` | `LibraryPage.tsx` | Active Product Screen | No |
| **Daily Routine** | `/routine` | `RoutinePage.tsx` | **New Presentation Shell** | **No** (Local Mock Data) |
| **Progress** | `/progress` | `ProgressPage.tsx` | **New Presentation Shell** | **No** (Local Mock Data) |
| **Profile** | `/profile` | `ProfilePage.tsx` | Active Product Screen | No |
| **Settings** | `/settings` | `SettingsPage.tsx` | **New Presentation Shell** | **No** (Local Mock Data) |

> **Boundary Invariant Verified**: No backend APIs, Supabase tables, or database migrations were created. All new route shells are strictly presentation components wrapped in `PageWrapper` and lazy-loaded via `React.lazy()`.

---

### 3. Desktop Sidebar Verification

#### 3.1 Dimensions & Layout
- **Expanded Width**: 256px (`w-64`).
- **Collapsed Width**: 80px (`w-20`).
- **PageWrapper Padding**: Responds dynamically to collapse state via `useUI()` (`lg:pl-64` expanded, `lg:pl-20` collapsed).
- **Positioning**: Fixed top-left with `h-screen`, `border-r border-border-default`, and `bg-background-surface`.

#### 3.2 Visual Styling
- **Group Labels**: Rendered in uppercase caption typography (`text-[10px] uppercase font-semibold text-text-tertiary tracking-wider px-3 pt-1 pb-1`).
- **Active Treatment**: Refined subtle forest green background tint (`bg-brand-primary/10`), bold font weight (`font-semibold`), and a crisp left accent border (`border-l-2 border-brand-primary`). The heavy saturated green pill from previous iterations is eliminated.
- **Collapsed Indicators**: When collapsed, active items display a centered 1.5px gold dot (`bg-brand-accent`) on the right margin.

---

### 4. Mobile Navigation & "More" Drawer Verification

#### 4.1 5-Item Priority Bottom Bar
To avoid cramped navigation on small screens, the mobile bottom bar prioritizes 5 essential destinations:
1. `Home` (`/home`)
2. `Chat` (`/chat`)
3. `Scan` (`/scan`, center elevated pill with camera icon)
4. `Progress` (`/progress`)
5. `More` (triggers the slide-up drawer)

#### 4.2 Slide-Up Drawer ("More" Sheet)
- **Trigger**: Tap on the "More" button in the bottom navigation.
- **Animation**: Smooth spring transition (`framer-motion`) from bottom of screen with backdrop overlay (`bg-black/40 backdrop-blur-xs`).
- **Contents**: Accessible links for `My History`, `Remedies`, `Daily Routine`, `Profile`, and `Settings`.
- **Dismissal**: Close button ('X') or tap on backdrop.

---

### 5. Verification Status: PASS
Evidence captured in:
- `05-home-dashboard-desktop-1280.png` (Expanded desktop sidebar with 9 items)
- `05-home-sidebar-collapsed-desktop-1280.png` (Collapsed 80px sidebar)
- `05-home-dashboard-mobile-375.png` (5-item mobile bottom navigation)
- `05-home-mobile-more-drawer-mobile-375.png` (Opened mobile "More" drawer)
