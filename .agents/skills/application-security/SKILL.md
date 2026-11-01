---
name: application-security
description: >-
  Provides security protocols, credential hygiene rules, data privacy standards, and input validation
  safeguards for web applications handling sensitive user data and third-party APIs. Use when reviewing
  security, handling API keys, validating file uploads, securing backend routes, configuring RLS, or managing privacy consent.
---

# Application Security, Privacy & Credential Hygiene

This skill enforces strict security, data protection, and privacy boundaries across the application. Because SKINMATE AI handles facial photographs and personal skin-health observations, privacy and security must be engineered into every layer.

---

## 1. Zero-Leakage Credential Architecture

1. **Server-Side Encapsulation:**
   * Secret keys (such as `YOUCAM_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) must **NEVER** have the `NEXT_PUBLIC_` prefix.
   * Never bundle secrets in frontend code, client components, or public GitHub repositories.
   * Add `.env`, `.env.local`, `.env.*.local` to `.gitignore`.
2. **Audit Check in Build:**
   * Add verification to ensure no secret is exposed in client chunks or git commits:
   ```bash
   git status --ignored
   ```

---

## 2. Facial Image & Biometric Privacy Policy

Facial images are sensitive personal data. Follow these strict privacy rules:
1. **Explicit User Consent:** Before camera capture or image upload, display clear notice explaining that the photograph will be processed by YouCam's Skin AI engine solely for cosmetic skin analysis.
2. **Ephemeral In-Memory Processing:**
   * Do not permanently store uncompressed high-resolution raw selfie photographs in public storage buckets unless explicitly saved by the user in their private journal.
   * Temporary analysis files should have time-to-live (TTL) expiration (YouCam server auto-expires processed images after 24 hours).
3. **User-Controlled Purging:** Users must have the ability to delete their skin analysis history, uploaded images, and personal profile with one click.

---

## 3. Strict File Upload & Payload Security

Never trust client-reported file metadata (`Content-Type` header alone can be forged). Validate file constraints on the server before dispatching:

```typescript
// src/lib/security/upload-guard.ts
export const UPLOAD_LIMITS = {
  maxSizeBytes: 8 * 1024 * 1024, // 8MB limit
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
};

export function validateImageUpload(file: File | Blob): { valid: boolean; error?: string } {
  if (file.size > UPLOAD_LIMITS.maxSizeBytes) {
    return { valid: false, error: "Image file exceeds the 8MB size limit." };
  }

  if (!UPLOAD_LIMITS.allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: "Unsupported image format. Please upload JPG, PNG, or WebP." };
  }

  return { valid: true };
}
```

---

## 4. API Route Protection & Rate Limiting

Prevent abuse, denial-of-service, or API credit exhaustion on paid AI endpoints:

1. **Authenticated Sessions:** For routes modifying routines, saving journals, or querying private history, verify the Supabase user session token:
   ```typescript
   const supabase = await createServerSupabaseClient();
   const { data: { user }, error } = await supabase.auth.getUser();
   if (error || !user) {
     return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
   }
   ```
2. **Rate Limiting:** Implement IP-based or session-based rate limits on the `/api/skin-analysis` and `/api/assistant` endpoints to prevent runaway loop calls.

---

## 5. Non-Medical Positioning & Regulatory Disclaimer

SKINMATE AI is a cosmetic guidance and shopping platform, **not a medical diagnostic tool or healthcare provider**.
* Include standard cosmetic disclosure across all analysis dashboards and recommendation outputs:
  > *"SKINMATE AI provides cosmetic skin observations and product suggestions based on visible facial characteristics. It does not provide medical diagnoses, dermatological prescriptions, or medical treatment plans. For persistent, severe, or painful skin conditions, please consult a board-certified dermatologist."*

---

## 6. Secure Logging Standards

* **Redact Sensitive Headers:** Never log `Authorization` headers, bearer tokens, or user passwords.
* **Redact Image Binaries:** Never log raw Base64 data strings or full binary arrays in server logs.
* Log structured error codes and request IDs instead of raw stack traces in client responses.
