# AayurFace — Phase 06.5 Screenshot Inventory & Visual Asset Index

**Audit Timestamp:** 2026-09-04T06:00:25Z  
**Audit Protocol:** Phase 06.5 Forensic Visual Audit & Quality Certification  
**Target Host:** `http://localhost:5173` (Production Preview Server — Vite v8.2.1)  
**Browser Engine:** Chromium Headless (`Google Chrome 128.0+`) via Puppeteer-Core  
**Asset Storage Location:** `docs/engineering/frontend/visual-audit/screenshots/` and mirror in `phase-06.5/`

---

## 1. Executive Summary of Captured Assets

A total of **41 deterministic screenshots** were captured across five standardized device viewport tiers:
1. **Desktop Standard (1280 × 800)**: Baseline desktop canvas with collapsed/expanded navigation and multi-column grid architecture.
2. **Desktop High-Res (1440 × 900)**: Wide desktop canvas verifying maximum container constraints (`max-w-7xl`, `max-w-5xl`) and background margins.
3. **Tablet Portrait (768 × 1024)**: Mid-breakpoint canvas verifying sidebar breakpoint suppression (`hidden lg:flex`), mobile navigation switch, and responsive fluid grids.
4. **Mobile Compact (375 × 812)**: iOS standard compact device verifying vertical touch targets (minimum 44×44px / 48×48px), horizontal overflow immunity, and floating scan CTA ergonomics.
5. **Mobile Modern (390 × 844)**: Modern smartphone viewport verifying fluid scaling, safe-area breathing room, and dynamic layout bounds.

All public screens were captured under an unauthenticated browser context. All internal application screens were captured under an authenticated session context primed with a realistic user profile (`Namrata Sen`, `namrata.sen@example.com`, `Vata-Pitta Profile`).

---

## 2. Comprehensive Screenshot Matrix

| # | Filename | Viewport | W×H (px) | Route / State | Context | File Size | Primary Visual Verification Focus |
|---|---|---|---|---|---|---|---|
| 01 | `01-landing-desktop-1280.png` | Desktop | 1280×800 | `/` | Public | 211.9 KB | Cormorant Garamond display typography, 50/30/20 palette ratio, hero botanical imagery, dual CTA cards. |
| 02 | `01-landing-desktop-1440.png` | Desktop High-Res | 1440×900 | `/` | Public | 217.2 KB | Wide canvas grid constraints (`max-w-7xl`), centered alignment, zero horizontal stretch or bleed. |
| 03 | `01-landing-tablet-768.png` | Tablet | 768×1024 | `/` | Public | 242.1 KB | Tablet navigation collapse, stacked hero content, fluid typography scaling. |
| 04 | `01-landing-mobile-375.png` | Mobile Compact | 375×812 | `/` | Public | 15.6 KB | Mobile compact stacking, 48px touch targets, mobile navigation bar, zero horizontal scrollbar. |
| 05 | `01-landing-mobile-390.png` | Mobile Modern | 390×844 | `/` | Public | 19.0 KB | Modern aspect ratio responsiveness, card spacing, legible body contrast. |
| 06 | `02-login-desktop-1280.png` | Desktop | 1280×800 | `/login` | Public | 359.8 KB | 50/50 split auth layout: single clean card left, botanical wisdom background right (bug fix verified). |
| 07 | `02-login-mobile-375.png` | Mobile Compact | 375×812 | `/login` | Public | 14.1 KB | Single centered auth card, botanical backdrop hidden, full-width inputs with 44px height. |
| 08 | `03-register-desktop-1280.png` | Desktop | 1280×800 | `/register` | Public | 380.5 KB | Registration form layout, password strength indicator, botanical right panel. |
| 09 | `03-register-mobile-375.png` | Mobile Compact | 375×812 | `/register` | Public | 15.5 KB | Mobile registration ergonomics, input padding, clean legal disclaimer. |
| 10 | `04-forgot-password-desktop-1280.png` | Desktop | 1280×800 | `/forgot-password` | Public | 356.2 KB | Password recovery workflow card, back to sign in navigation. |
| 11 | `04-forgot-password-mobile-375.png` | Mobile Compact | 375×812 | `/forgot-password` | Public | 11.4 KB | Compact password reset screen, touch targets. |
| 12 | `05-home-dashboard-desktop-1280.png` | Desktop | 1280×800 | `/home` | Authenticated | 44.0 KB | Left sidebar (w-64) + main content (lg:pl-64 = 256px), greeting header, scan banner, Dinacharya rituals, daily wisdom. |
| 13 | `05-home-dashboard-desktop-1440.png` | Desktop High-Res | 1440×900 | `/home` | Authenticated | 50.0 KB | Max container bounds on wide desktop, sidebar anchoring, doshic balance widgets. |
| 14 | `05-home-dashboard-tablet-768.png` | Tablet | 768×1024 | `/home` | Authenticated | 38.7 KB | Hidden desktop sidebar, visible bottom navigation, fluid dashboard cards. |
| 15 | `05-home-dashboard-mobile-375.png` | Mobile Compact | 375×812 | `/home` | Authenticated | 25.8 KB | Bottom navigation bar with floating elevated Scan button (`-mt-5`), ritual checklist interaction. |
| 16 | `05-home-dashboard-mobile-390.png` | Mobile Modern | 390×844 | `/home` | Authenticated | 27.2 KB | iPhone modern viewport, padding-bottom 80px clearance over bottom nav. |
| 17 | `06-scan-capture-desktop-1280.png` | Desktop | 1280×800 | `/scan` | Authenticated | 17.6 KB | Camera viewfinder modal, privacy banner (`On-device EXIF Stripping Active`), gold corner alignment guides, oval face reticle. |
| 18 | `06-scan-capture-mobile-375.png` | Mobile Compact | 375×812 | `/scan` | Authenticated | 13.4 KB | Full-screen mobile viewfinder, thumb-accessible camera trigger button. |
| 19 | `08-results-desktop-1280.png` | Desktop | 1280×800 | `/results/demo-scan` | Authenticated | 37.2 KB | Multimodal synthesis banner, primary imbalance meter (45% Pitta), 3-bar dosha breakdown, 5 etiology observation cards. |
| 20 | `08-results-mobile-375.png` | Mobile Compact | 375×812 | `/results/demo-scan` | Authenticated | 22.8 KB | Mobile stacked results layout, full-width doshic meters, clean metric cards. |
| 21 | `09-library-desktop-1280.png` | Desktop | 1280×800 | `/library` | Authenticated | 39.7 KB | Dravyaguna knowledge base header, search bar, category pills (`Acne`, `Dryness`, `Oiliness`), 4-card remedy grid. |
| 22 | `09-library-filter-desktop-1280.png` | Desktop | 1280×800 | `/library?q=Neem` | Authenticated | 34.9 KB | Live keyword filtering state, instant search results update. |
| 23 | `09-library-mobile-375.png` | Mobile Compact | 375×812 | `/library` | Authenticated | 21.5 KB | Horizontally scrollable category pills (`overflow-x-auto`), single column cards. |
| 24 | `09-library-saved-desktop-1280.png` | Desktop | 1280×800 | `/library?tab=saved` | Authenticated | 24.3 KB | Saved rituals segmented tab, empty/filtered state verification. |
| 25 | `10-remedy-detail-neem-desktop-1280.png` | Desktop | 1280×800 | `/library/neem-turmeric-face-mask` | Authenticated | 30.8 KB | Formulation hero, prep time badge (20 mins), botanical ingredients grid, step-by-step Krama list, safety notice. |
| 26 | `10-remedy-detail-neem-mobile-375.png` | Mobile Compact | 375×812 | `/library/neem-turmeric-face-mask` | Authenticated | 21.5 KB | Mobile remedy detail readability, ingredients list layout, back navigation button. |
| 27 | `10-remedy-detail-kumkumadi-desktop-1280.png` | Desktop | 1280×800 | `/library/kumkumadi-radiance-elixir` | Authenticated | 30.8 KB | Multi-slug route resolution, dynamic title, classical saffron formulation attributes. |
| 28 | `10-remedy-detail-aloe-desktop-1280.png` | Desktop | 1280×800 | `/library/aloe-vera-rosewater-soothing-gel` | Authenticated | 30.8 KB | Pitta cooling formulation detail, ingredient proportions, contraindication disclaimer. |
| 29 | `11-chat-empty-desktop-1280.png` | Desktop | 1280×800 | `/chat` | Authenticated | 24.8 KB | Initial conversational state, assistant welcome bubble, clean background, disclaimer banner. |
| 30 | `11-chat-empty-mobile-375.png` | Mobile Compact | 375×812 | `/chat` | Authenticated | 18.6 KB | Mobile chat header, bottom input dock above mobile nav, message thread viewport bounds. |
| 31 | `11-chat-conversation-desktop-1280.png` | Desktop | 1280×800 | `/chat` (Active) | Authenticated | 30.0 KB | Conversational exchange: user query in dark green bubble, assistant response in white surface bubble with herbal icon. |
| 32 | `12-profile-desktop-1280.png` | Desktop | 1280×800 | `/profile` | Authenticated | 30.5 KB | User avatar (`N`), profile identity, doshic badges, 3 metric cards, longitudinal assessment check-in history. |
| 33 | `12-profile-mobile-375.png` | Mobile Compact | 375×812 | `/profile` | Authenticated | 22.6 KB | Mobile profile layout, quick action buttons, settings list. |
| 34 | `13-edit-profile-desktop-1280.png` | Desktop | 1280×800 | `/profile/edit` | Authenticated | 29.9 KB | Profile update form, dosha Prakriti selector pills, save/cancel buttons. |
| 35 | `13-edit-profile-mobile-375.png` | Mobile Compact | 375×812 | `/profile/edit` | Authenticated | 20.8 KB | Mobile form ergonomics, form input focus styling, vertical stack. |
| 36 | `14-onboarding-step1-desktop-1280.png` | Desktop | 1280×800 | `/onboarding` (Step 1) | Authenticated | 18.9 KB | Step 1 welcome card, step indicators (progress bar), botanical benefit callouts. |
| 37 | `14-onboarding-step2-desktop-1280.png` | Desktop | 1280×800 | `/onboarding` (Step 2) | Authenticated | 19.8 KB | Step 2 skin profile questionnaire, selection cards, state retention. |
| 38 | `14-onboarding-step3-desktop-1280.png` | Desktop | 1280×800 | `/onboarding` (Step 3) | Authenticated | 14.8 KB | Step 3 completion confirmation, transition to dashboard CTA. |
| 39 | `14-onboarding-mobile-375.png` | Mobile Compact | 375×812 | `/onboarding` | Authenticated | 15.7 KB | Mobile questionnaire cards, touch target compliance, clean progress dots. |
| 40 | `15-not-found-desktop-1280.png` | Desktop | 1280×800 | `/unknown-route` | Public/Auth | 12.3 KB | 404 Pathway Not Found page, compass icon, graceful return to dashboard button. |
| 41 | `15-not-found-mobile-375.png` | Mobile Compact | 375×812 | `/unknown-route` | Public/Auth | 9.9 KB | Mobile 404 layout, centered layout, no broken assets. |

---

## 3. Verification Integrity Signoff

Every screenshot recorded above is present on physical disk at:
- `docs/engineering/frontend/visual-audit/screenshots/`
- `docs/engineering/frontend/visual-audit/phase-06.5/`

Captured using real browser automation with zero simulated mocks, zero design canvas exports, and zero placeholders.
