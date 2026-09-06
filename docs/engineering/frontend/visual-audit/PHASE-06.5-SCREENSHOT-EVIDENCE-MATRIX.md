# AayurFace — Phase 06.5 Screenshot Evidence Matrix & Forensic File Ledger

**Audit Protocol:** Zero-Trust Forensic Verification & File Integrity Check  
**Physical Directory Inspected:** `D:\Project Aayurface\docs\engineering\frontend\visual-audit\screenshots\`  
**Mirror Directory Inspected:** `D:\Project Aayurface\docs\engineering\frontend\visual-audit\phase-06.5\`  
**Image Dimension Verification Tool:** PNG IHDR Chunk Binary Inspection (`UInt32BE` offset 16 & 20)  
**Verification Date:** 2026-09-04  

---

## 1. Quantitative Inventory Summary

| Metric | Measured Value | Forensic Observation |
|---|---|---|
| **Claimed Screenshot Count** | 41 | Count claimed in previous visual audit. |
| **Actual Screenshot Count** | 41 | Exact count of `.png` files residing on physical disk. |
| **Missing Required Viewport (1280 × 720)** | 16 | **CRITICAL DISCREPANCY:** All desktop baseline screenshots were captured at **1280 × 800 (16:10)** rather than the mandated **1280 × 720 (16:9 standard)**. Per Section 3 of challenge, 1280×720 visual verification is marked **UNVERIFIED**. |
| **Missing Layout States** | 2 | Collapsed sidebar state (`sidebarCollapsed: true`, `lg:pl-20`) was never captured. |
| **Missing Form States** | 3 | Auth validation error and loading spinner states were never captured. |
| **Duplicate Content Screenshots** | 2 | `10-remedy-detail-kumkumadi-desktop-1280.png` and `10-remedy-detail-aloe-desktop-1280.png` both display fallback `MOCK_REMEDIES[0]` (Neem) due to slug parameter mismatch in capture script. |
| **Corrupted / Invalid Images** | 0 | All 41 image files contain valid PNG headers and IHDR chunks. |

---

## 2. Exhaustive Screenshot Verification Matrix

| # | Exact Filename | Route Tested | State | Viewport | Target Spec | Actual Dimensions | File Size | Exists? | Valid PNG? | Inspected? | Forensic Result & Concrete Visual Findings |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | `01-landing-desktop-1280.png` | `/` | Default | Desktop | 1280×720 | **1280 × 800** | 211.9 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch 1280×800 vs 720)**. Concrete: Cormorant Garamond 60px headline aligned with left copy; balanced 7/5 col split; right botanical card clean. |
| 02 | `01-landing-desktop-1440.png` | `/` | Default | Desktop-Wide | 1440×900 | 1440 × 900 | 217.2 KB | YES | YES | YES | **PASS**. Concrete: Max container `max-w-7xl` constrains layout properly; zero horizontal stretching; ample margin whitespace. |
| 03 | `01-landing-tablet-768.png` | `/` | Default | Tablet | 768×1024 | 768 × 1024 | 242.1 KB | YES | YES | YES | **PASS**. Concrete: Top navigation links collapsed cleanly into compact actions; hero content stacks vertically; botanical image reflows gracefully. |
| 04 | `01-landing-mobile-375.png` | `/` | Default | Mobile Compact | 375×812 | 375 × 812 | 15.6 KB | YES | YES | YES | **PASS**. Concrete: Headline font scales to compact size; zero horizontal scroll; primary CTA is full width with 48px touch height. |
| 05 | `01-landing-mobile-390.png` | `/` | Default | Mobile Modern | 390×844 | 390 × 844 | 19.0 KB | YES | YES | YES | **PASS**. Concrete: Safe margin breathing room preserved; clean contrast on warm canvas. |
| 06 | `02-login-desktop-1280.png` | `/login` | Default | Desktop | 1280×720 | **1280 × 800** | 359.8 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Single clean white card left (`max-w-md`), atmospheric wisdom panel right. Zero duplicate card nesting. |
| 07 | `02-login-mobile-375.png` | `/login` | Default | Mobile Compact | 375×812 | 375 × 812 | 14.1 KB | YES | YES | YES | **PASS**. Concrete: Right atmospheric panel hidden; single centered card fills mobile width; 44px input targets. |
| 08 | `03-register-desktop-1280.png` | `/register` | Default | Desktop | 1280×720 | **1280 × 800** | 380.5 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: 4 input fields stacked in single card; right botanical panel intact. Bottom "Sign In" link sits close to lower border. |
| 09 | `03-register-mobile-375.png` | `/register` | Default | Mobile Compact | 375×812 | 375 × 812 | 15.5 KB | YES | YES | YES | **PASS**. Concrete: Vertical form stacking fits within mobile viewport with natural vertical scroll. |
| 10 | `04-forgot-password-desktop-1280.png` | `/forgot-password` | Default | Desktop | 1280×720 | **1280 × 800** | 356.2 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Single input card with Back to Sign In link. |
| 11 | `04-forgot-password-mobile-375.png` | `/forgot-password` | Default | Mobile Compact | 375×812 | 375 × 812 | 11.4 KB | YES | YES | YES | **PASS**. Concrete: Mobile centered form card. |
| 12 | `05-home-dashboard-desktop-1280.png` | `/home` | Expanded | Desktop | 1280×720 | **1280 × 800** | 44.0 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Fixed sidebar (256px wide); main content unobstructed with exact 256px padding-left clearance. Hero scan banner, rituals list, and daily wisdom card properly positioned. |
| 13 | `05-home-dashboard-desktop-1440.png` | `/home` | Expanded | Desktop-Wide | 1440×900 | 1440 × 900 | 50.0 KB | YES | YES | YES | **PASS**. Concrete: Sidebar anchored left; content centered in `max-w-7xl`; generous breathing room. |
| 14 | `05-home-dashboard-tablet-768.png` | `/home` | Default | Tablet | 768×1024 | 768 × 1024 | 38.7 KB | YES | YES | YES | **PASS**. Concrete: Desktop sidebar hidden; bottom navigation visible; cards reflow to single column. |
| 15 | `05-home-dashboard-mobile-375.png` | `/home` | Default | Mobile Compact | 375×812 | 375 × 812 | 25.8 KB | YES | YES | YES | **PASS**. Concrete: Floating elevated center camera button (`-mt-5`) in bottom nav bar; ritual checklist items tap-friendly. |
| 16 | `05-home-dashboard-mobile-390.png` | `/home` | Default | Mobile Modern | 390×844 | 390 × 844 | 27.2 KB | YES | YES | YES | **PASS**. Concrete: Bottom clearance `pb-20` prevents bottom navigation from occluding content. |
| 17 | `06-scan-capture-desktop-1280.png` | `/scan` | Viewfinder | Desktop | 1280×720 | **1280 × 800** | 17.6 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Dark ambient viewfinder (`#0E1512`), oval reticle with gold corner brackets. Disclaimer "On-device EXIF Stripping Active" present (UI badge only). |
| 18 | `06-scan-capture-mobile-375.png` | `/scan` | Viewfinder | Mobile Compact | 375×812 | 375 × 812 | 13.4 KB | YES | YES | YES | **PASS**. Concrete: Full viewport camera viewfinder with thumb trigger. |
| 19 | `08-results-desktop-1280.png` | `/results/demo-scan` | Default | Desktop | 1280×720 | **1280 × 800** | 37.2 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Multimodal synthesis card, primary imbalance radial gauge (45% Pitta), 3-bar dosha meters, 5 observable factor cards. |
| 20 | `08-results-mobile-375.png` | `/results/demo-scan` | Default | Mobile Compact | 375×812 | 375 × 812 | 22.8 KB | YES | YES | YES | **PASS**. Concrete: Dosha breakdown meters stack vertically with clear text and progress bars. |
| 21 | `09-library-desktop-1280.png` | `/library` | All Formulations | Desktop | 1280×720 | **1280 × 800** | 39.7 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Dravyaguna header, search bar, category filter chips, 4-card remedy grid with ingredients. |
| 22 | `09-library-filter-desktop-1280.png` | `/library?q=Neem` | Filtered | Desktop | 1280×720 | **1280 × 800** | 34.9 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Live text search input displays "Neem"; filtered cards show Neem formulations. |
| 23 | `09-library-mobile-375.png` | `/library` | All Formulations | Mobile Compact | 375×812 | 375 × 812 | 21.5 KB | YES | YES | YES | **PASS**. Concrete: Category chips scroll horizontally without vertical crowding. |
| 24 | `09-library-saved-desktop-1280.png` | `/library?tab=saved` | Saved Tab | Desktop | 1280×720 | **1280 × 800** | 24.3 KB | YES | YES | YES | **PARTIAL / DEFECT**. Concrete: Displays "No remedies found" empty state because default mock saved IDs (`['remedy-1', 'remedy-3']`) do not match actual mock remedy IDs (`'r1'`, `'r3'`). |
| 25 | `10-remedy-detail-neem-desktop-1280.png` | `/library/neem-...` | Detail | Desktop | 1280×720 | **1280 × 800** | 30.8 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Neem & Turmeric Face Mask detail, prep time badge (20 mins), 4 botanical ingredients, numbered Krama steps. |
| 26 | `10-remedy-detail-neem-mobile-375.png` | `/library/neem-...` | Detail | Mobile Compact | 375×812 | 375 × 812 | 21.5 KB | YES | YES | YES | **PASS**. Concrete: Mobile ingredients grid and preparation steps readable and unclipped. |
| 27 | `10-remedy-detail-kumkumadi-desktop-1280.png` | `/library/kumkumadi-...` | Detail | Desktop | 1280×720 | **1280 × 800** | 30.8 KB | YES | YES | YES | **DUPLICATE OF NEEM (Script Parameter Defect)**. Concrete: Script used non-existent slug `kumkumadi-radiance-elixir` (correct is `kumkumadi-brightening-oil`), falling back to Neem. |
| 28 | `10-remedy-detail-aloe-desktop-1280.png` | `/library/aloe-...` | Detail | Desktop | 1280×720 | **1280 × 800** | 30.8 KB | YES | YES | YES | **DUPLICATE OF NEEM (Script Parameter Defect)**. Concrete: Script used non-existent slug `aloe-vera-rosewater-soothing-gel` (correct is `aloe-vera-rose-water-toner`), falling back to Neem. |
| 29 | `11-chat-empty-desktop-1280.png` | `/chat` | Empty Thread | Desktop | 1280×720 | **1280 × 800** | 24.8 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Top welcome greeting bubble, suggestion prompt pills above bottom composer. Large empty whitespace in middle canvas. |
| 30 | `11-chat-empty-mobile-375.png` | `/chat` | Empty Thread | Mobile Compact | 375×812 | 375 × 812 | 18.6 KB | YES | YES | YES | **PASS**. Concrete: Chat container fits viewport; input bar docked above mobile navigation. |
| 31 | `11-chat-conversation-desktop-1280.png` | `/chat` | Active Thread | Desktop | 1280×720 | **1280 × 800** | 30.0 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: User message in dark green bubble right; assistant response in white surface card left. Non-medical disclaimer docked at bottom. |
| 32 | `12-profile-desktop-1280.png` | `/profile` | Default | Desktop | 1280×720 | **1280 × 800** | 30.5 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: User initials avatar, name, email, doshic badges, 3 metric counters, longitudinal check-in list, sign-out button. |
| 33 | `12-profile-mobile-375.png` | `/profile` | Default | Mobile Compact | 375×812 | 375 × 812 | 22.6 KB | YES | YES | YES | **PASS**. Concrete: Centered profile layout, settings options cleanly stacked. |
| 34 | `13-edit-profile-desktop-1280.png` | `/profile/edit` | Form | Desktop | 1280×720 | **1280 × 800** | 29.9 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Profile edit form with 4 constitution selector cards (Vata selected with checkmark). |
| 35 | `13-edit-profile-mobile-375.png` | `/profile/edit` | Form | Mobile Compact | 375×812 | 375 × 812 | 20.8 KB | YES | YES | YES | **PASS**. Concrete: Constitution selector cards stack into 1 column on mobile. |
| 36 | `14-onboarding-step1-desktop-1280.png` | `/onboarding` | Wizard Step 1 | Desktop | 1280×720 | **1280 × 800** | 18.9 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Step 1 welcome card, top progress pill, 3 feature summary callouts, Continue CTA. |
| 37 | `14-onboarding-step2-desktop-1280.png` | `/onboarding` | Wizard Step 2 | Desktop | 1280×720 | **1280 × 800** | 19.8 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Step 2 skin tendency questionnaire with 5 selection cards (`Dry` selected). |
| 38 | `14-onboarding-step3-desktop-1280.png` | `/onboarding` | Wizard Step 3 | Desktop | 1280×720 | **1280 × 800** | 14.8 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Camera & biometric privacy consent card with dual completion actions. |
| 39 | `14-onboarding-mobile-375.png` | `/onboarding` | Wizard Mobile | Mobile Compact | 375×812 | 375 × 812 | 15.7 KB | YES | YES | YES | **PASS**. Concrete: Onboarding wizard card centered with full mobile width. |
| 40 | `15-not-found-desktop-1280.png` | `/unknown-route` | 404 Error | Desktop | 1280×720 | **1280 × 800** | 12.3 KB | YES | YES | YES | **UNVERIFIED (Viewport Mismatch)**. Concrete: Compass icon, Cormorant Garamond heading "Pathway Not Found", Return to Dashboard CTA. |
| 41 | `15-not-found-mobile-375.png` | `/unknown-route` | 404 Error | Mobile Compact | 375×812 | 375 × 812 | 9.9 KB | YES | YES | YES | **PASS**. Concrete: Mobile 404 layout centered and clean. |

---

## 3. Discrepancy & Verification Summary

1. **Mandated 1280 × 720 Viewport Status:**
   - **`UNVERIFIED`**: All 16 claimed desktop baseline screenshots were captured at **1280 × 800**, NOT 1280 × 720. While the layout functions properly at 800px height, the specific 720p aspect ratio standard was not captured.
2. **Valid and Verified Viewports:**
   - **1440 × 900 (Desktop-Wide)**: Verified and passed.
   - **768 × 1024 (Tablet Portrait)**: Verified and passed.
   - **375 × 812 (Mobile Compact)**: Verified and passed.
   - **390 × 844 (Mobile Modern)**: Verified and passed.
3. **Capture Script Artifacts:**
   - Slugs for Kumkumadi and Aloe Vera in `capture-visual-audit.cjs` did not match `src/lib/mockData.ts`, producing duplicate screenshots of the fallback Neem remedy.
   - The Library "Saved" tab default mock IDs mismatch caused the saved tab to render in an empty state rather than populated cards.
