# AayurFace — Database Architecture Specification
## Biometric Facial Data, Storage Architecture & Quality Metadata

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Computer Vision Architect, Data Security Architect  
**Validation Notice:** Quality metric threshold numbers represent target engineering calibrations (**PROPOSED / REQUIRES VALIDATION**).  

---

### 1. Architectural Separation: Object Storage vs Relational Metadata

AayurFace enforces a strict physical separation between raw biometric image binaries and relational metadata:
* **Private S3 Object Storage (`facial-captures/`):** High-resolution image files reside exclusively in private object storage, accessed via ephemeral HMAC-signed URLs.
* **PostgreSQL Relational Storage (`captures` & `capture_quality_metrics`):** Stores only technical metadata, quality gateway scores, storage paths, and retention states. Zero binary image data touches the database.

---

### 2. Physical Storage Path Partitioning

Objects in the private S3 bucket follow a strict tenant-isolated path structure:
```text
s3://facial-captures/${userId}/${captureId}.jpg
```
* `${userId}`: Authenticated user UUID (`auth.uid()`).
* `${captureId}`: Cryptographically generated UUIDv7 primary key of the corresponding `captures` table row.
* File format is strictly JPEG (`image/jpeg`); maximum payload size is capped at 5 MB ($5,242,880\text{ bytes}$).

---

### 3. Concrete Relational Schema Models

```sql
-- Target Schema for Biometric Captures & Quality Metadata (Milestone 08)

CREATE TABLE captures (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    storage_path VARCHAR(255) NOT NULL UNIQUE,
    mime_type VARCHAR(50) NOT NULL DEFAULT 'image/jpeg',
    file_size_bytes INT NOT NULL CHECK (file_size_bytes <= 5242880),
    checksum_sha256 VARCHAR(64) NOT NULL,
    retention_state VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
        CHECK (retention_state IN ('ACTIVE', 'MARKED_FOR_PURGE', 'PURGED')),
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    purged_at TIMESTAMPTZ
);

CREATE TABLE capture_quality_metrics (
    capture_id UUID PRIMARY KEY REFERENCES captures(id) ON DELETE CASCADE,
    face_count INT NOT NULL CHECK (face_count = 1),
    landmark_confidence FLOAT NOT NULL CHECK (landmark_confidence BETWEEN 0.0 AND 1.0),
    yaw_deg FLOAT NOT NULL CHECK (yaw_deg BETWEEN -45.0 AND 45.0),
    pitch_deg FLOAT NOT NULL CHECK (pitch_deg BETWEEN -45.0 AND 45.0),
    roll_deg FLOAT NOT NULL CHECK (roll_deg BETWEEN -45.0 AND 45.0),
    centering_offset_pct FLOAT NOT NULL CHECK (centering_offset_pct BETWEEN 0.0 AND 100.0),
    mean_luminance FLOAT NOT NULL CHECK (mean_luminance BETWEEN 0.0 AND 255.0),
    laplacian_blur_variance FLOAT NOT NULL CHECK (laplacian_blur_variance >= 0.0),
    is_acceptable BOOLEAN NOT NULL,
    raw_landmarks JSONB, -- Stored only if research consent active
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 4. Quality Gateway Calibration Standards (Target Proposals)

| Quality Signal | Target Measurement | Target Calibration Threshold | Failure Behavior | Status |
|---|---|---|---|---|
| **Face Count** | MediaPipe FaceMesh detection count | Exactly 1 face ($N = 1$) | Gateway displays: *"Ensure only one face is visible."* | Target Invariant |
| **Landmark Confidence** | Tracking score from ML model | $\ge 0.85$ | Gateway disables capture button. | Proposed / Requires Validation |
| **Pose Angle (Yaw/Pitch)**| Angular head rotation from center | Within $\pm 15.0^\circ$ | Gateway displays: *"Face camera directly."* | Proposed / Requires Validation |
| **Centering Offset** | Distance from centroid to guide oval | Within $\le 15.0\%$ of frame center | Gateway displays: *"Align face within oval."* | Proposed / Requires Validation |
| **Luminance (Lighting)** | Mean gray luma of facial ROI | $80.0 \le \text{Luma} \le 220.0$ ($0\text{--}255$ scale) | Gateway displays: *"Lighting too dim / too bright."* | Proposed / Requires Validation |
| **Sharpness (Blur)** | Laplacian operator variance | $\ge 100.0$ | Gateway displays: *"Hold phone still to reduce blur."*| Proposed / Requires Validation |

---

### 5. Biometric Retention Governance (DEC-004)

* **Open Decision Reminder:** The permanent retention period for raw facial captures in `facial-captures/` remains an open business and privacy decision:
  * **Option A (Immediate Purge):** S3 object is deleted via API within 60 seconds of successful feature extraction. `captures.retention_state` transitions to `PURGED`.
  * **Option B (Rolling 30-Day Retention):** Retained in private S3 for 30 days via S3 Bucket Lifecycle automated rule to allow monthly visual progress comparisons.
* In either option, `scan_results.capture_id` is configured with `ON DELETE SET NULL`, ensuring historical analysis records remain intact even after the raw image is purged.
