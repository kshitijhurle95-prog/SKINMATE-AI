---
name: rest-api-integration
description: >-
  Provides patterns, HTTP client architectures, asynchronous polling utilities, exponential backoff retries,
  and response normalizers for third-party REST API integrations. Use when integrating external services,
  calling the YouCam Skin AI API, writing resilient fetch wrappers, polling async tasks, or normalizing responses.
---

# Resilient REST API Integration & Backend Architecture

This skill establishes patterns for integrating external RESTful APIs (such as the YouCam Skin AI API) within Next.js server-side route handlers. It emphasizes bulletproof error recovery, polling lifecycles, timeout management, and strict response normalization.

---

## 1. Core Engineering Tenets

1. **Server-Side Exclusivity:** Third-party APIs requiring bearer tokens or secret keys must only be invoked from server environments (`src/app/api/...` route handlers or Server Actions).
2. **Fail-Fast Request Timeouts:** Every external HTTP call must be wrapped with an `AbortController` timeout to prevent hanging connections.
3. **Exponential Backoff on Transient Errors:** Network glitches and HTTP 429 (Rate Limit) or 503 (Service Unavailable) must retry with exponential jitter.
4. **Data Normalization Layer:** Never leak third-party API data structures directly to frontend components. Transform external payloads into clean internal TypeScript models.

---

## 2. Resilient Fetch Utility with Timeout & Retries

```typescript
// src/lib/api/fetcher.ts
export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export async function resilientFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeoutMs = 12000,
    maxRetries = 2,
    retryDelayMs = 1000,
    ...fetchInit
  } = options;

  let attempt = 0;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchInit,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Handle rate limits or temporary gateway errors with retry
      if ((response.status === 429 || response.status >= 502) && attempt < maxRetries) {
        attempt++;
        const backoff = retryDelayMs * Math.pow(2, attempt) + Math.random() * 200;
        console.warn(`[resilientFetch] Status ${response.status}. Retrying attempt ${attempt} in ${backoff}ms...`);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorBody.slice(0, 300)}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
      }
      if (attempt >= maxRetries) {
        throw err;
      }
      attempt++;
      await new Promise((r) => setTimeout(r, retryDelayMs * attempt));
    }
  }

  throw new Error(`Failed to complete request to ${url} after ${maxRetries} retries`);
}
```

---

## 3. Asynchronous Task Polling Engine

Asynchronous computer vision APIs (like YouCam Skin Analysis) return a `task_id` that must be polled until status becomes `success` or `error`:

```typescript
// src/lib/api/poller.ts
export interface PollingConfig<T> {
  pollFn: () => Promise<T>;
  isComplete: (data: T) => boolean;
  isError: (data: T) => { error: boolean; message?: string };
  intervalMs?: number;
  maxWaitTimeMs?: number;
}

export async function pollAsyncTask<T>({
  pollFn,
  isComplete,
  isError,
  intervalMs = 1500,
  maxWaitTimeMs = 30000,
}: PollingConfig<T>): Promise<T> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTimeMs) {
    const result = await pollFn();

    const errorStatus = isError(result);
    if (errorStatus.error) {
      throw new Error(`Task failed: ${errorStatus.message || "Unknown API processing failure"}`);
    }

    if (isComplete(result)) {
      return result;
    }

    // Flexible wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Task polling timed out after ${maxWaitTimeMs / 1000} seconds`);
}
```

---

## 4. Response Normalization & Isolation

External schemas often change across API versions (e.g., YouCam v2.0 vs v2.1). Protect the frontend by normalizing into an internal format:

```typescript
export interface NormalizedSkinMetric {
  concernKey: string;
  displayName: string;
  score: number;             // 0-100 normalized score
  severity: "optimal" | "mild" | "moderate" | "high";
  maskUrl?: string;
  explanation: string;
}

export function normalizeMetric(key: string, rawScore: number, maskUrl?: string): NormalizedSkinMetric {
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));
  
  let severity: NormalizedSkinMetric["severity"] = "optimal";
  if (score < 40) severity = "high";
  else if (score < 65) severity = "moderate";
  else if (score < 80) severity = "mild";

  return {
    concernKey: key,
    displayName: formatConcernName(key),
    score,
    severity,
    maskUrl,
    explanation: getConcernExplanation(key, severity),
  };
}
```
