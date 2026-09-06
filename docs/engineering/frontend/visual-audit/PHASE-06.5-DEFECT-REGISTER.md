# AayurFace — Phase 06.5 Defect Register & Resolution Forensic Record

**Audit Timestamp:** 2026-09-04T06:15:00Z  
**Audit Protocol:** Rigorous Forensic Classification (P0 / P1 / P2 / P3 / P4)  
**Verification Standard:** Evidence-First, Zero-Hallucination, Code & Log Attributed

---

## 1. Defect Severity Classification Matrix

| Severity | Definition | Threshold Criteria | Action SLA |
|---|---|---|---|
| **P0 — Catastrophic** | Application crashes, unhandled exceptions, complete blockage of core user journey, security leak, data loss. | Build fails, White Screen of Death (WSOD), auth bypass, unhandled JS error in console. | Immediate blocker to deployment or phase gate. |
| **P1 — Major Visual / Functional** | Layout breaking, persistent horizontal scrolling, content occlusion by navigation elements, WCAG AAA/AA contrast violation on primary text. | Elements clipped under fixed navigation, broken grid reflow, overlapping interactive elements. | Must be resolved and verified before phase sign-off. |
| **P2 — Moderate Alignment / State** | Inconsistent component padding, incorrect transition curves, modal dismiss timing anomalies, state desync on page reload. | Padding off by >8px, missing focus outline on tab, unstyled flash of content. | Resolved within phase rebuild. |
| **P3 — Minor Visual Polish** | Micro-typography kerning, icon alignment by 1-2px, subtle box-shadow elevation deviation, unused import warnings. | Strict linter/compiler warnings, minor aesthetic inconsistencies. | Cleaned up during build hardening. |
| **P4 — Trivial / Browser Advisory** | Browser vendor-specific recommendations (e.g. Chrome DOM autocomplete suggestions). | Non-blocking verbose console notices. | Logged in register, scheduled for Phase 07. |

---

## 2. Complete Defect Register & Resolution Ledger

| Defect ID | Severity | Category | Symptom / Description | Root Cause | Affected File(s) | Resolution & Evidence | Status |
|---|---|---|---|---|---|---|---|
| **DEF-001** | **P1** | Layout / CSSOM | Desktop content under `<main>` occluded by 256px fixed sidebar (`lg:pl-64` computed to `0px`). | **CSS Cascade Layer Specificity**: Unlayered `* { margin: 0; padding: 0; }` declared at root of `src/index.css` overrode Tailwind v4 `@layer utilities` (`.lg\:pl-64`). Under CSS Cascade Layers Level 4, unlayered rules always beat layered rules. | `src/index.css`, `src/components/layout/PageWrapper.tsx` | Wrapped base styles inside `@layer base` and removed unlayered universal reset. Rebuilt Vite assets. Verified via Puppeteer DOM evaluation: `mainPaddingLeft = '256px'`. Occlusion completely resolved. | **RESOLVED & VERIFIED** |
| **DEF-002** | **P1** | Visual Structure | Double-nested card border and double padding on Login, Register, and Forgot Password screens. | Outer `<AuthLayout>` wrapped inner form cards which themselves rendered full `<AyurCard>` containers with duplicate backgrounds, borders, and shadows. | `src/layouts/AuthLayout.tsx`, `src/pages/auth/LoginPage.tsx`, `src/pages/auth/RegisterPage.tsx`, `src/pages/auth/ForgotPasswordPage.tsx` | Rebuilt `AuthLayout.tsx` with dedicated 50/50 desktop split (clean left panel, botanical wisdom right panel) and removed redundant inner card nesting. Verified in `02-login-desktop-1280.png`. | **RESOLVED & VERIFIED** |
| **DEF-003** | **P1** | UX / Navigation | Chat page rendered in an isolated shell without standard sidebar or bottom navigation, trapping users. | `ChatPage.tsx` did not use `<PageWrapper>` and rendered an uncoordinated full-screen div without navigation routes. | `src/pages/chat/ChatPage.tsx` | Wrapped `ChatPage.tsx` inside `<PageWrapper>` with fixed bottom input bar. Verified in `11-chat-empty-desktop-1280.png` and `11-chat-conversation-desktop-1280.png`. | **RESOLVED & VERIFIED** |
| **DEF-004** | **P1** | Routing / Param | Remedy detail navigation failed or showed empty state when navigated from Library cards. | Library card links used `:slug` (`/library/neem-turmeric-face-mask`) while route definition expected `:id` or vice versa, causing lookup failures in mock data. | `src/routes/index.tsx`, `src/pages/library/RemedyDetailPage.tsx`, `src/data/mockData.ts` | Aligned route to `/library/:slug` and updated `RemedyDetailPage.tsx` to search by `slug || id`. Verified across 3 distinct remedy detail screenshots (`10-remedy-detail-*`). | **RESOLVED & VERIFIED** |
| **DEF-005** | **P1** | Accessibility | Dosha badge text colors failed WCAG AA contrast against pale tinted badge backgrounds. | High-chroma orange (`#f97316`) on pale amber (`#fef3c7`) produced a 2.4:1 contrast ratio (failing WCAG AA 4.5:1 minimum). | `src/components/common/SkinBadge.tsx`, `src/index.css` | Hardened dosha badge color palette to use WCAG AA compliant dark text tokens (`#78350f` for Pitta, `#1e293b` for Vata, `#064e3b` for Kapha), achieving >7:1 contrast. | **RESOLVED & VERIFIED** |
| **DEF-006** | **P2** | State / Layout | Sidebar collapsed state desynchronized with page content wrapper padding. | Sidebar and PageWrapper each maintained independent collapse states without a shared context provider. | `src/contexts/UIContext.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/PageWrapper.tsx` | Implemented centralized `UIContext` providing `sidebarCollapsed` and `toggleSidebar()`. Both `Sidebar` (w-64 vs w-20) and `PageWrapper` (lg:pl-64 vs lg:pl-20) bind directly to `UIContext`. | **RESOLVED & VERIFIED** |
| **DEF-007** | **P2** | Auth Flow | Profile logout button clicked did not clear session storage or trigger state change. | `signOut` handler in `ProfilePage.tsx` lacked call to `auth.signOut()` before navigating. | `src/pages/profile/ProfilePage.tsx`, `src/contexts/AuthContext.tsx` | Bound logout action to `signOut()` in `AuthContext` which clears `localStorage.removeItem('aayurface_session')` and navigates to `/login`. | **RESOLVED & VERIFIED** |
| **DEF-008** | **P2** | Visual Quality | Scan capture screen lacked clinical alignment guides and privacy trust cues. | Early prototype camera view rendered raw video stream with generic button overlay. | `src/pages/scan/ScanPage.tsx` | Added Cormorant Garamond title, on-device privacy badge (`On-device EXIF Stripping Active`), gold corner brackets (`#c5a059`), and dashed oval face reticle. Verified in `06-scan-capture-desktop-1280.png`. | **RESOLVED & VERIFIED** |
| **DEF-009** | **P2** | Mobile UX | Scan button in mobile bottom navigation lacked visual hierarchy and primary affordance. | Bottom nav rendered 5 identical flat text-and-icon links without elevation or thumb prioritization. | `src/components/layout/BottomNav.tsx` | Rebuilt mobile bottom nav with elevated center circular camera CTA (`-mt-5`, `w-13 h-13`, `rounded-full`, shadow-md) with 48px touch target. Verified in `05-home-dashboard-mobile-375.png`. | **RESOLVED & VERIFIED** |
| **DEF-010** | **P3** | Build / Static Analysis | TypeScript compilation failed with unused variable warnings under strict configuration (`noUnusedLocals: true`). | 9 unused Lucide icons and Framer Motion imports remained in rebuilt page files during rapid refactoring. | `src/pages/chat/ChatPage.tsx`, `src/pages/library/LibraryPage.tsx`, `src/pages/library/RemedyDetailPage.tsx`, `src/pages/home/ResultsPage.tsx`, `src/pages/public/LandingPage.tsx` | Cleaned all unreferenced imports. `tsc -b` now exits with code 0 (zero errors). | **RESOLVED & VERIFIED** |
| **DEF-011** | **P3** | Tooling / Script | Puppeteer visual audit script cross-contaminated auth session across navigations. | Shared browser context executed `localStorage.removeItem` before navigating to public routes, destroying session on subsequent internal routes. | `scripts/capture-visual-audit.cjs` | Architected script with two isolated browser contexts (`publicContext` and `authContext`). All 41 screenshots captured reliably. | **RESOLVED & VERIFIED** |
| **DEF-012** | **P4** | Browser Advisory | Chrome DevTools logged verbose DOM warnings suggesting `autocomplete` attributes on password fields. | Standard password `<input>` tags lacked explicit `autocomplete="current-password"` or `autocomplete="new-password"` attributes. | `src/pages/auth/LoginPage.tsx`, `src/pages/auth/RegisterPage.tsx` | Non-blocking browser autofill hint. Logged in console audit; does not impact rendering or functionality. Scheduled for Phase 07 hardening. | **DOCUMENTED / LOW PRIORITY** |

---

## 3. Residual Defect Summary

- **Open P0 Defects:** 0
- **Open P1 Defects:** 0
- **Open P2 Defects:** 0
- **Open P3 Defects:** 0
- **Open P4 Advisories:** 1 (Form `autocomplete` attributes documented)

**Conclusion:** All critical, major, moderate, and minor defects that affected visual hierarchy, responsive layout, navigation integrity, and build safety have been systematically remediated and verified through automated test suites and real browser capture.
