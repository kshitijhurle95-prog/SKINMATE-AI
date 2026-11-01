import { describe, it } from "node:test";
import assert from "node:assert";
import { normalizeYouCamOutput, VERIFIED_YOUCAM_DEMO_RESULT } from "@/lib/youcam/client";

describe("YouCam Skin AI Integration Client", () => {
  it("should normalize raw YouCam API output into typed skin metrics", () => {
    const rawYouCamOutput = [
      {
        type: "pore",
        ui_score: 58,
        raw_score: 0.42,
        mask_urls: ["https://yce-api-01.makeupar.com/masks/demo_pore.png"],
      },
      {
        type: "oiliness",
        ui_score: 48,
        raw_score: 0.52,
      },
      {
        type: "moisture",
        ui_score: 82,
        raw_score: 0.82,
      },
      {
        type: "redness",
        ui_score: 74,
        raw_score: 0.26,
      },
    ];

    const normalized = normalizeYouCamOutput(rawYouCamOutput, "task-test-123");

    assert.strictEqual(normalized.id, "task-test-123");
    assert.strictEqual(normalized.metrics.length, 4);

    const poreMetric = normalized.metrics.find((m) => m.type === "pore");
    assert.ok(poreMetric);
    assert.strictEqual(poreMetric.score, 58);
    assert.strictEqual(poreMetric.severity, "moderate");
    assert.strictEqual(poreMetric.displayName, "Visible Pores");
    assert.strictEqual(poreMetric.maskUrl, "https://yce-api-01.makeupar.com/masks/demo_pore.png");

    const oilMetric = normalized.metrics.find((m) => m.type === "oiliness");
    assert.ok(oilMetric);
    assert.strictEqual(oilMetric.severity, "high");

    const moistureMetric = normalized.metrics.find((m) => m.type === "moisture");
    assert.ok(moistureMetric);
    assert.strictEqual(moistureMetric.severity, "optimal");

    // Check mask tracking
    assert.strictEqual(normalized.activeMasksAvailable.includes("pore"), true);

    // Check cosmetic disclaimer
    assert.strictEqual(normalized.disclaimer.includes("Not a medical diagnosis"), true);
  });

  it("should verify the verified demo dataset adheres to YouCam specifications", () => {
    assert.ok(VERIFIED_YOUCAM_DEMO_RESULT);
    assert.strictEqual(typeof VERIFIED_YOUCAM_DEMO_RESULT.overallScore, "number");
    assert.strictEqual(VERIFIED_YOUCAM_DEMO_RESULT.metrics.length >= 10, true);

    // Verify all metrics have safe cosmetic advice
    for (const metric of VERIFIED_YOUCAM_DEMO_RESULT.metrics) {
      assert.ok(metric.displayName);
      assert.ok(metric.cosmeticAdvice);
      assert.strictEqual(metric.score >= 0 && metric.score <= 100, true);
    }
  });
});
