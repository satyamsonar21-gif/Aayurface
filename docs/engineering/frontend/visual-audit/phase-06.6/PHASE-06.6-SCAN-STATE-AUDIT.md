# AayurFace — Phase 06.6 Scan State Audit
## Forensic Inspection of the Reconstructed Digital Wellness Capture State Machine

---

### 1. State Machine Architecture

The Scan capture experience (`src/pages/app/ScanPage.tsx`) was rebuilt to eliminate ad-hoc boolean flags and implement a deterministic, single-source-of-truth guidance state machine.

```
[ preparing ]
      │
      ▼
[ quality_checking ]
      │
      ▼
[ ready ] ◄── (CTA Enabled)
      │
      ▼ (user clicks Capture)
[ capturing ]
      │
      ▼
[ processing ] (Multi-stage Ayurvedic progression)
      │
      ▼
[ /results/demo-scan ]
```

---

### 2. Guidance State Inventory & Copy Mapping

| State ID | UI Header Label | Guidance Subtext | CTA State | Visual Feedback |
|---|---|---|---|---|
| `preparing` | "Preparing Camera…" | Initializing video feed and ambient illumination. | Disabled | Neutral pulse |
| `no_face` | "Position Your Face Inside the Guide" | Align your face within the oval reticle to begin. | Disabled | Amber pulse |
| `too_far` | "Move Slightly Closer" | Bring your face closer to the camera for clearer detail. | Disabled | Amber pulse |
| `too_close` | "Move Slightly Back" | Step back slightly to fit your entire face in frame. | Disabled | Amber pulse |
| `off_center` | "Center Your Face" | Position eyes and chin within the alignment brackets. | Disabled | Amber pulse |
| `poor_lighting` | "Find Softer, Even Lighting" | Avoid strong backlights or harsh shadows. | Disabled | Amber pulse |
| `movement` | "Hold Still for a Moment" | Keep still to allow sharp capture. | Disabled | Amber pulse |
| `quality_checking` | "Checking Image Quality…" | Verifying facial alignment and light distribution. | Disabled | Gold pulse |
| `ready` | "You're Ready" | Alignment and lighting verified. Press Capture when ready. | **Enabled** | **Emerald pulse + Gold Reticle Glow** |
| `capturing` | "Capturing…" | Acquiring high-resolution facial observables. | Disabled | Active shutter pulse |
| `processing` | "Preparing Your Personalized Insight…" | Correlating observables with classical Ayurvedic patterns. | Disabled | Breathing circular animation |
| `error` | "We couldn't complete the capture" | Camera permissions unavailable or stream interrupted. | Disabled | Error card with Retry & Upload |

---

### 3. False EXIF Claim Removal Audit

#### Previous Defect
The previous Phase 06.5 prototype displayed a badge in the header:
```html
<span>On-device EXIF Stripping Active</span>
```
The forensic evidence verification determined this claim was entirely unbacked by code; no EXIF stripping library was integrated into the client image pipeline.

#### Current Verified Implementation
In `src/pages/app/ScanPage.tsx`:
```tsx
<span className="text-[11px] text-text-inverse/70 flex items-center gap-1 font-body">
  <ShieldCheck size={11} className="text-brand-accent" />
  Client-Side Image Stream • Non-Diagnostic
</span>
```
- **Claim status**: **REMOVED**.
- **Framing**: Neutral, factual description of client-side stream and non-diagnostic educational scope.

---

### 4. Capture CTA Gating Verification

- **Inactive / Checking State**: Capture CTA renders with `bg-white/10 text-text-inverse/40 border-white/5 cursor-not-allowed` and `disabled={!currentFeedback.isReady}`. User clicks produce zero action.
- **Ready State**: When the state transitions to `ready`, the CTA upgrades to `bg-brand-primary text-text-inverse border-brand-accent` with active cursor and hover states.
- **Trigger**: Clicking the active CTA initiates `capturing` followed by `processing`, successfully transitioning to `/results/demo-scan`.

---

### 5. Multi-Stage Processing Progression

During the `processing` state, four sequential Ayurvedic milestones are displayed with animated stepper dots:
1. `Verifying Lighting & Uniformity…`
2. `Extracting Doshic Surface Observables…`
3. `Synthesizing Prakriti Constitutional Markers…`
4. `Formulating Grounded Botanical Regimen…`

Upon reaching step 4, the application automatically navigates to `/results/demo-scan`.

---

### 6. Verification Status: PASS
Evidence captured in:
- `06-scan-capture-desktop-1280.png` (Initial capture / viewfinder)
- `06-scan-ready-desktop-1280.png` (Verified 'ready' state)
- `07-scan-processing-desktop-1280.png` (Verified processing state)
