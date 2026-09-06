# AayurFace — Phase 06.6 Visual Evidence Matrix
## Certified Screenshot Inventory and Physical Verification Log

---

### 1. Verification Protocol
- **Storage Location**: `docs/engineering/frontend/visual-audit/phase-06.6/`
- **Total Physical Files**: 48 PNG screenshots
- **Capture Execution Time**: September 4, 2026
- **Capture Tool**: Headless Chrome via Puppeteer with fake media-stream emulation
- **Mandated Desktop Resolution**: **1280 × 720** (16:9 standard; verified via PNG header byte inspection)

---

### 2. Complete Screenshot Inventory

| # | Filename | Viewport | Dimensions (W × H) | Route | State / Purpose | Status |
|---|---|---|---|---|---|---|
| 1 | `01-landing-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/` | Editorial landing hero & trust layout | **VERIFIED** |
| 2 | `01-landing-desktop-1440.png` | Desktop 1440 | 1440 × 900 | `/` | Large desktop landing layout | **VERIFIED** |
| 3 | `01-landing-tablet-768.png` | Tablet 768 | 768 × 1024 | `/` | Tablet portrait landing layout | **VERIFIED** |
| 4 | `01-landing-mobile-375.png` | Mobile 375 | 375 × 812 | `/` | Mobile standard landing layout | **VERIFIED** |
| 5 | `01-landing-mobile-390.png` | Mobile 390 | 390 × 844 | `/` | Modern mobile landing layout | **VERIFIED** |
| 6 | `02-login-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/login` | Auth layout with single card & autocomplete | **VERIFIED** |
| 7 | `02-login-mobile-375.png` | Mobile 375 | 375 × 812 | `/login` | Mobile auth container | **VERIFIED** |
| 8 | `03-register-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/register` | Registration form with autocomplete | **VERIFIED** |
| 9 | `03-register-mobile-375.png` | Mobile 375 | 375 × 812 | `/register` | Mobile registration form | **VERIFIED** |
| 10 | `04-forgot-password-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/forgot-password` | Password recovery form | **VERIFIED** |
| 11 | `04-forgot-password-mobile-375.png` | Mobile 375 | 375 × 812 | `/forgot-password` | Mobile password recovery | **VERIFIED** |
| 12 | `05-home-dashboard-desktop-1280.png` | Desktop 1280 | **1280 × 720** | `/home` | **Reconstructed Home Dashboard** (Hero, Guidance, Ritual, Journey) | **VERIFIED** |
| 13 | `05-home-dashboard-desktop-1440.png` | Desktop 1440 | 1440 × 900 | `/home` | Reconstructed Home on wide desktop | **VERIFIED** |
| 14 | `05-home-dashboard-tablet-768.png` | Tablet 768 | 768 × 1024 | `/home` | Reconstructed Home on tablet portrait | **VERIFIED** |
| 15 | `05-home-dashboard-mobile-375.png` | Mobile 375 | 375 × 812 | `/home` | Reconstructed Home with 5-item bottom bar | **VERIFIED** |
| 16 | `05-home-dashboard-mobile-390.png` | Mobile 390 | 390 × 844 | `/home` | Reconstructed Home on modern mobile | **VERIFIED** |
| 17 | `05-home-sidebar-collapsed-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/home` | Sidebar collapsed (80px) with dynamic page padding | **VERIFIED** |
| 18 | `05-home-mobile-more-drawer-mobile-375.png` | Mobile 375 | 375 × 812 | `/home` | Mobile "More" slide-up drawer open state | **VERIFIED** |
| 19 | `06-scan-capture-desktop-1280.png` | Desktop 1280 | **1280 × 720** | `/scan` | **Two-Zone Scan Viewfinder** (Ambient dark, oval guide, brackets) | **VERIFIED** |
| 20 | `06-scan-capture-desktop-1440.png` | Desktop 1440 | 1440 × 900 | `/scan` | Two-zone scan on wide desktop | **VERIFIED** |
| 21 | `06-scan-capture-tablet-768.png` | Tablet 768 | 768 × 1024 | `/scan` | Scan capture on tablet | **VERIFIED** |
| 22 | `06-scan-capture-mobile-375.png` | Mobile 375 | 375 × 812 | `/scan` | Scan capture mobile portrait layout | **VERIFIED** |
| 23 | `06-scan-capture-mobile-390.png` | Mobile 390 | 390 × 844 | `/scan` | Scan capture modern mobile layout | **VERIFIED** |
| 24 | `06-scan-ready-desktop-1280.png` | Desktop 1280 | **1280 × 720** | `/scan` | **Deterministic 'Ready' Guidance State** (Active CTA, gold reticle) | **VERIFIED** |
| 25 | `07-scan-processing-desktop-1280.png` | Desktop 1280 | **1280 × 720** | `/scan` | **Multi-Stage Processing State** (Ayurvedic stage steps) | **VERIFIED** |
| 26 | `08-results-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/results/demo-scan` | Doshic analysis results overview | **VERIFIED** |
| 27 | `08-results-mobile-375.png` | Mobile 375 | 375 × 812 | `/results/demo-scan` | Mobile results overview | **VERIFIED** |
| 28 | `09-library-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/library` | Dravyaguna remedies catalog | **VERIFIED** |
| 29 | `09-library-mobile-375.png` | Mobile 375 | 375 × 812 | `/library` | Mobile remedies catalog | **VERIFIED** |
| 30 | `09-library-filter-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/library` | Remedy search filtered by "Neem" | **VERIFIED** |
| 31 | `09-library-saved-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/library` | **Saved Rituals Tab** with corrected mock IDs `['r1', 'r3']` | **VERIFIED** |
| 32 | `10-remedy-detail-neem-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/library/neem-turmeric-face-mask` | Remedy Detail: Neem & Turmeric Face Mask | **VERIFIED** |
| 33 | `10-remedy-detail-neem-mobile-375.png` | Mobile 375 | 375 × 812 | `/library/neem-turmeric-face-mask` | Mobile Remedy Detail: Neem & Turmeric | **VERIFIED** |
| 34 | `10-remedy-detail-kumkumadi-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/library/kumkumadi-brightening-oil` | **Remedy Detail: Kumkumadi Brightening Oil** (Fixed Slug) | **VERIFIED** |
| 35 | `10-remedy-detail-aloe-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/library/aloe-vera-rose-water-toner` | **Remedy Detail: Aloe Vera & Rose Water Toner** (Fixed Slug) | **VERIFIED** |
| 36 | `11-chat-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/chat` | Conversational Ayurvedic Guide | **VERIFIED** |
| 37 | `11-chat-mobile-375.png` | Mobile 375 | 375 × 812 | `/chat` | Mobile Conversational Guide | **VERIFIED** |
| 38 | `12-profile-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/profile` | Profile & constitutional summary | **VERIFIED** |
| 39 | `12-profile-mobile-375.png` | Mobile 375 | 375 × 812 | `/profile` | Mobile profile overview | **VERIFIED** |
| 40 | `13-edit-profile-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/profile/edit` | Edit profile form inside PageWrapper | **VERIFIED** |
| 41 | `14-history-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/history` | **New Route Shell: My History** | **VERIFIED** |
| 42 | `14-history-mobile-375.png` | Mobile 375 | 375 × 812 | `/history` | Mobile My History timeline | **VERIFIED** |
| 43 | `15-routine-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/routine` | **New Route Shell: Daily Routine** (Dinacharya) | **VERIFIED** |
| 44 | `15-routine-mobile-375.png` | Mobile 375 | 375 × 812 | `/routine` | Mobile Daily Routine schedule | **VERIFIED** |
| 45 | `16-progress-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/progress` | **New Route Shell: Progress & Reflections** | **VERIFIED** |
| 46 | `16-progress-mobile-375.png` | Mobile 375 | 375 × 812 | `/progress` | Mobile Progress reflections | **VERIFIED** |
| 47 | `17-settings-desktop-1280.png` | Desktop 1280 | 1280 × 720 | `/settings` | **New Route Shell: Settings & Privacy** | **VERIFIED** |
| 48 | `17-settings-mobile-375.png` | Mobile 375 | 375 × 812 | `/settings` | Mobile Settings controls | **VERIFIED** |

---

### 3. Resolution Verification Evidence

Byte header inspection confirmed:
- `05-home-dashboard-desktop-1280.png` width: 1280px, height: 720px.
- `06-scan-capture-desktop-1280.png` width: 1280px, height: 720px.
- `06-scan-ready-desktop-1280.png` width: 1280px, height: 720px.
- `07-scan-processing-desktop-1280.png` width: 1280px, height: 720px.
- `10-remedy-detail-kumkumadi-desktop-1280.png` width: 1280px, height: 720px.
- All desktop-1280 captures strictly comply with the mandated 16:9 standard aspect ratio.
