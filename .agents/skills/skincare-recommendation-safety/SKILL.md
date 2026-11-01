---
name: skincare-recommendation-safety
description: >-
  Provides ingredient science standards, catalog data integrity rules, cosmetic terminology guidelines,
  and medical disclaimer boundaries for skincare applications. Use when verifying product ingredient claims,
  crafting cosmetic explanations, ensuring regulatory compliance, or validating skincare recommendation logic.
---

# Skincare Product Data & Recommendation Safety

This skill establishes the scientific standards, cosmetic terminology rules, and regulatory boundaries for SKINMATE AI. It ensures that all ingredient education, routine guidance, and product descriptions remain accurate, grounded, and compliant with cosmetic guidelines.

---

## 1. Cosmetic vs. Medical Language Boundaries

SKINMATE AI is a **cosmetic intelligence and shopping guidance platform**, not a medical device or healthcare provider. Adhere strictly to these terminology boundaries:

| Strictly Prohibited (Medical Claims) | Mandatory Approved (Cosmetic Phrasing) |
| :--- | :--- |
| ❌ "Diagnoses acne, eczema, or dermatitis" | ✅ "Identifies visible blemishes, redness, or surface texture" |
| ❌ "Treats, cures, or heals acne lesions" | ✅ "Helps cleanse excess surface oil and clear clogged pores" |
| ❌ "Eliminates wrinkles and reverses aging" | ✅ "Helps improve the appearance of fine lines and skin smoothness" |
| ❌ "Prescribed medical treatment plan" | ✅ "Suggested daily cosmetic skincare routine" |
| ❌ "Clinically proves skin improvement" | ✅ "Shows observable differences in visible scan metrics" |

---

## 2. Standard Cosmetic Ingredient Knowledge Base

When generating product match explanations or educational tooltips, strictly ground descriptions in these accepted cosmetic mechanisms:

### 1. Niacinamide (Vitamin B3)
* **Cosmetic Purpose:** Supports the natural skin moisture barrier, helps even the appearance of skin tone, and balances surface sebum production.
* **Common Forms:** 2%–10% serums, lightweight moisturizers.
* **Usage Advice:** Well-tolerated by most skin types; pairs well with Hyaluronic Acid and Ceramides.

### 2. Hyaluronic Acid & Sodium Hyaluronate
* **Cosmetic Purpose:** Potent humectant that attracts and binds water to the skin's surface, enhancing suppleness and hydration.
* **Usage Advice:** Best applied to damp skin followed by an occlusive moisturizer to seal in hydration.

### 3. Salicylic Acid (Beta Hydroxy Acid - BHA)
* **Cosmetic Purpose:** Oil-soluble chemical exfoliant that penetrates pores to loosen sebum, debris, and dead skin cells.
* **Usage Advice:** Ideal for oily and blemish-prone skin; recommend starting 2–3 times per week to monitor tolerance.

### 4. Ceramides (NP, AP, EOP)
* **Cosmetic Purpose:** Essential lipids naturally found in the skin barrier that help replenish moisture and protect against environmental dryness.
* **Usage Advice:** Suitable for all skin types, especially dry or barrier-compromised skin.

### 5. Vitamin C (L-Ascorbic Acid / Derivatives)
* **Cosmetic Purpose:** Powerful cosmetic antioxidant that defends against environmental oxidants and helps brighten the appearance of dull skin.
* **Usage Advice:** Recommended for morning use followed by broad-spectrum sunscreen.

### 6. Retinol & Retinoids
* **Cosmetic Purpose:** Enhances surface skin renewal and improves the appearance of uneven texture and fine lines.
* **Usage Advice:** Recommended strictly for evening use; always pair with daytime broad-spectrum SPF.

---

## 3. Product Catalog Data Integrity Standards

1. **Grounded Products Only:** Products must correspond to real formulations, brands, and verified market prices in INR (e.g. Minimalist, Cetaphil, CeraVe, Plum, Dot & Key, Neutrogena).
2. **Transparent Price Sources:** Store prices in INR reflecting standard MRP and retail listings.
3. **Ingredient Traceability:** Display the primary active percentages and clear allergen/irritant disclosures (e.g. fragrance-free, essential oil-free, non-comedogenic).

---

## 4. Mandatory User Safety & Patch-Test Guidance

Every routine recommendation must include practical consumer safety reminders:
1. **Patch Testing:** Always recommend patch-testing new active products behind the ear or on the inner arm for 24 hours before full facial application.
2. **Sunscreen Necessity:** Any routine incorporating exfoliating acids (AHAs/BHAs) or retinoids must require daytime broad-spectrum SPF 30+ protection.
3. **Keep Routines Simple:** Discourage aggressive layering of multiple strong active acids simultaneously. Favor gentle, consistent routines over harsh treatments.
