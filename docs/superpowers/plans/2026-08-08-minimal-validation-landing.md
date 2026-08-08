# Corner AI Minimal Validation Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce the landing page to one minimal conversion surface: headline, concise context, concrete boxing result, one beta CTA, one supporting positioning line, and footer.

**Architecture:** Keep the existing static HTML/CSS/JS app and Supabase-backed beta dialog. Replace only visible landing-page markup and styling; preserve `app.js`, `config.js`, form behavior, analytics, and database schema. The video element is removed from the visible page until a real concept video exists.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Supabase REST, Vercel.

## Global Constraints

- Keep one visible primary CTA: `Join the beta`.
- Keep the headline: `Stop practicing the same mistakes.`
- Keep one short economic-context sentence; no comparison cards or long explainer sections.
- Make the concrete result nearly as prominent as the headline.
- Desktop: result beside copy. Mobile: result directly underneath.
- Keep current near-black / white / lime visual system.
- Preserve the existing beta form, Supabase submissions, and funnel analytics.
- Do not show a video placeholder until a real concept video exists.

---

### Task 1: Collapse the landing-page content

**Files:**
- Modify: `index.html`

- [ ] Replace all visible sections with a single hero containing the approved headline, two concise context sentences, one CTA, and the concrete `6/10 → 2` result.
- [ ] Add the single supporting positioning line below the hero.
- [ ] Keep only the minimal footer and existing hidden beta dialog.
- [ ] Remove all repeated CTAs, comparison cards, pain section, how-it-works section, and visible video markup.

### Task 2: Simplify the visual hierarchy

**Files:**
- Modify: `styles.css`

- [ ] Replace section-heavy layout rules with a two-column desktop hero and stacked mobile hero.
- [ ] Make the result panel product-like, restrained, and visually dominant without extra decorative cards.
- [ ] Keep the form/dialog styling and accessibility states intact.
- [ ] Verify no horizontal overflow at 1440px desktop and 390px mobile.

### Task 3: Functional and conversion QA

**Files:**
- Verify: `index.html`, `styles.css`, `app.js`, `config.js`

- [ ] Verify exactly one visible `.js-beta-cta` exists.
- [ ] Verify CTA opens the beta dialog and `form_start` still fires on first field focus.
- [ ] Mock Supabase POSTs in browser QA and verify successful submission reaches the success state and emits `form_submit`.
- [ ] Verify above-the-fold copy contains no unapproved extra marketing sections.
- [ ] Capture desktop and mobile screenshots and inspect spacing, hierarchy, readability, and overflow.

### Task 4: Publish

**Files:**
- GitHub `main`
- Vercel production deployment

- [ ] Commit the tested `index.html` and `styles.css` changes to `main`.
- [ ] Deploy the exact revision to Vercel production.
- [ ] Verify Vercel reports the deployment as `READY`.
