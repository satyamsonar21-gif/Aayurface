# AayurFace — Responsive Behavior Specification
## Breakpoint Adaptations, Viewport Transformations & Mobile Ergonomics

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Responsive Design & Layout Engineering  
**Status:** `TARGET RESPONSIVE SPECIFICATION`  
**Authority:** Staff UX Engineer, Interaction Designer  

---

## 1. Breakpoint Adaptation Matrix

| UI Component / Screen Area | Mobile Viewport (`< 768px`) | Tablet Viewport (`768px – 1023px`) | Desktop Viewport (`>= 1024px`) |
|---|---|---|---|
| **App Navigation** | Fixed Bottom Navigation Bar (5 Tabs) | Top Bar + Collapsible Rail Nav | Persistent Left Sidebar ($260\text{px}$) |
| **Dashboard Layout** | Single-column vertical stream | 2-column balanced grid | 3-column asymmetric layout |
| **Camera Viewport** | 100vh Fullscreen Viewfinder | Centered Card Viewport ($480\text{px}$) | Centered Card Viewport ($520\text{px}$) |
| **Results Tri-Dosha Gauge** | Scaled gauge ($240\text{px}$) | Centered gauge ($280\text{px}$) | Side-by-side gauge ($320\text{px}$) + details |
| **Dinacharya Routine Cards**| Full-width swipeable cards | 2-column grid cards | Multi-column Kala timeline |
| **Modal Dialogs** | Bottom Sheet Drawer (`DrawerSheet`) | Centered Modal Dialog (`max-w-md`)| Centered Modal Dialog (`max-w-lg`) |
| **Typography Scaling** | Hero: `32px` / Body: `14px` | Hero: `36px` / Body: `15px` | Hero: `40px` / Body: `16px` |
