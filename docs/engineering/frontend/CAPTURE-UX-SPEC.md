# AayurFace — UX Specification: Biometric Facial Capture
## Standardized Capture Experience, Real-Time Quality Guidance & Privacy Gate

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Biometric Capture & Wasm Quality Gate  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Computer Vision Architect, Accessibility Architect  

---

## 1. The 8-Stage Capture Journey Flow

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FACIAL CAPTURE USER JOURNEY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Permission Request ──► Friendly educational explanation of camera access │
│ 2. Camera Stream Init ──► 1080p/720p stream in circular viewport            │
│ 3. Wasm Mesh Track    ──► MediaPipe 468-point mesh tracks face in real-time │
│ 4. Quality Guidance   ──► Dynamic feedback: "Move closer", "More light"     │
│ 5. Alignment Hold     ──► Circular border transitions Amber ──► Green       │
│ 6. Auto/Manual Snap   ──► High-resolution frame captured to memory canvas   │
│ 7. EXIF Scrubbing     ──► Client redraws image to strip GPS/hardware EXIF   │
│ 8. Secure Signed PUT  ──► Binary PUT directly to private S3 bucket          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Real-Time Guidance & Error Recovery Matrix

| Capture Scenario / Error | Real-Time UI Feedback | Visual State of Guide Ring | Audio / Haptic Feedback | Recovery Action |
|---|---|---|---|---|
| **No Camera Permission** | Full-screen modal: *"Camera access is required for facial analysis."* | Disabled / Dark overlay | None | Button linking to browser permission settings + Upload Photo fallback. |
| **No Face Detected** | Text: *"Position your face within the circle"* | Dashed Amber ring (`#C5A059`) | None | User centers head in viewfinder. |
| **Face Too Far (<25% area)**| Text: *"Please move a little closer"* | Dashed Amber ring | Gentle pulse | User moves device closer. |
| **Face Too Close (>70% area)**| Text: *"Please move slightly back"* | Dashed Amber ring | Gentle pulse | User moves device back. |
| **Insufficient Lighting (<250 lux)**| Text: *"Lighting is too dim. Face a light source."*| Warning Amber ring with Sun icon| None | User turns toward a window or lamp. |
| **Motion Blur Detected** | Text: *"Hold steady for a clear capture"* | Warning Amber ring | None | User stabilizes hands. |
| **Multiple Faces Detected** | Text: *"Multiple faces detected. Please scan alone."*| Error Red ring (`#C62828`) | Double buzz | Other individuals step out of frame. |
| **Quality Approved (Optimal)**| Text: *"Perfect! Hold still..."* (1.5s countdown)| Solid Forest Green ring (`#1E3A2F`)| Single subtle haptic chime| Automatic capture triggered upon timer. |
