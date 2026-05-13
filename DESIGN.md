# Design System Document

## 1. Overview & Creative North Star: "The Digital Inkwell"
The design system for this platform is built on the philosophy of **"The Digital Inkwell."** Much like the art of calligraphy or the precision of a well-edited manuscript, this system bridges the tactile world of English Language Arts and Reading (ELAR) with the vibrant, iterative world of digital pixels. 

Our "Creative North Star" is to provide a high-end, editorial experience that feels authoritative for Texas educators yet accessible and playful for students. We break the "generic dashboard" mold by replacing rigid 1px grids with **intentional asymmetry, overlapping tonal surfaces, and high-contrast typography.** The pixel-art mascot, "Koi," acts as the soul of the interface—introducing moments of digital craft into a modern, breathable layout.

---

## 2. Colors
Our palette is rooted in the high-contrast relationship between vibrant energy and academic grounding.

*   **Primary Palette:** `primary` (#964300) and `primary_container` (#fc8639) represent the "Koi Orange." Use the container for large, energetic student-facing elements and the deeper primary for accessible text and teacher-facing actions.
*   **The Foundation:** `surface` (#f6f6f6) provides a crisp, paper-like background, while `on_surface` (#2d2f2f) ensures the charcoal-black depth required for long-form reading.

### The "No-Line" Rule
To achieve a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** Instead, boundaries must be defined through background color shifts. For example, a `surface_container_low` sidebar should sit directly against a `surface` main content area. The eye should perceive change through tone, not lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface_container` tiers to create depth:
1.  **Level 0 (Base):** `surface`
2.  **Level 1 (Sub-sections):** `surface_container_low` (#f0f1f1)
3.  **Level 2 (Active Cards):** `surface_container_highest` (#dbdddd)

### The "Glass & Gradient" Rule
Standard flat colors can feel sterile. To add "visual soul":
*   **Signature Gradients:** For primary CTAs and Hero backgrounds, transition from `primary` to `primary_container` at a 135-degree angle.
*   **Glassmorphism:** For floating navigation or modals, use `surface_container_lowest` at 80% opacity with a `24px` backdrop blur. This allows the vibrant Koi orange to bleed through softly, creating a sophisticated, integrated feel.

---

## 3. Typography
The typography system prioritizes the "Playful yet Professional" balance by pairing two distinct sans-serifs.

*   **Display & Headlines (Plus Jakarta Sans):** This font provides the "friendly, rounded" feel requested for student engagement. `display-lg` (3.5rem) and `headline-md` (1.75rem) should be used for lesson titles and motivational prompts.
*   **Interface & Body (Work Sans):** A highly readable, workhorse font for the actual ELAR content. `body-lg` (1rem) is the standard for reading passages, ensuring students can focus on the text without eye strain.
*   **Intentional Contrast:** Use `label-sm` in all-caps with `0.05em` letter-spacing for teacher-specific metadata (e.g., TEKS standards) to differentiate academic data from student-facing narrative.

---

## 4. Elevation & Depth
In this system, elevation is an expression of light and material, not just "drop shadows."

*   **Tonal Layering Principle:** Depth is achieved by stacking. Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f0f1f1) background. This creates a soft, natural lift that feels like fine stationery.
*   **Ambient Shadows:** When a floating effect is necessary (e.g., the mascot's speech bubble), use an extra-diffused shadow: `Y: 8px, Blur: 24px, Opacity: 6%` using the `on_surface` color. 
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use the `outline_variant` (#acadad) at **20% opacity**. This provides a "hint" of a container without breaking the editorial flow.
*   **Pixel Accents:** To honor the "Koi" mascot, use the `sm` (0.125rem) or `none` (0px) roundedness for specific accent corners to mimic a pixelated edge, while using `xl` (0.75rem) for the main body of the container to maintain a modern aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary_container`) with `xl` (0.75rem) roundedness. Use `on_primary` text.
*   **Secondary:** A "Ghost" style. No fill, `outline_variant` at 20% opacity, with `primary` text.
*   **Pixel-Action:** A unique button type for student rewards. Use a solid charcoal (`on_background`) fill with a `none` (0px) roundedness to lean into the pixel-art aesthetic.

### Cards & Lists
*   **Forbid dividers.** Use `spacing-8` (2rem) of vertical white space to separate ELAR reading modules. 
*   **Nesting:** Place student response areas in `surface_container_highest` containers to visually "recess" them into the page, inviting the student to "fill" the space.

### Text Annotation (ELAR Specific)
*   When students highlight text, use `tertiary_container` (#febf2a) with 40% opacity. It mimics a traditional highlighter while staying within the warm, encouraging color family.

### Progress Trackers
*   Use horizontal bars with `full` (9999px) roundedness. The background should be `surface_container_high`, and the progress fill should be the `primary_fixed` vibrant orange.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Place a large header on the left and a small pixel-art "Koi" tip on the far right to create a dynamic, editorial flow.
*   **Do** use the Spacing Scale rigorously. `spacing-12` (3rem) should be the minimum margin for main content blocks to ensure "breathing room."
*   **Do** treat the pixel-art mascot as a peer. "Koi" should appear in speech bubbles using `body-md` text to provide encouragement.

### Don't
*   **Don't** use pure black (#000000). Always use the charcoal `on_background` (#2d2f2f) or the specified deep charcoal (#1A1A1A) to keep the UI sophisticated.
*   **Don't** use standard Material Design shadows. They are too heavy for this "high-end editorial" aesthetic.
*   **Don't** clutter the screen with icons. Use typography and color shifts to lead the user's eye first; icons should only be used as supportive visual cues for younger readers.

---
*Director's Final Note: This system is not a template; it is a canvas. Every layout should feel like a carefully composed page of a high-end educational journal.*