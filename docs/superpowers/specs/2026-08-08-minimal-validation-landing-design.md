# Corner AI Minimal Validation Landing — Design

## Goal

Make the landing page ruthlessly minimal and conversion-focused. The page should communicate the value of Corner AI in seconds, show a concrete result immediately, and give visitors one obvious action: join the beta.

## Positioning

Corner AI is the missing middle between training alone with no feedback and paying for a private coach every time. The page should imply this with one short line of context rather than explaining the full market argument.

Core message:

- You can train alone, but you cannot reliably see your own technique mistakes.
- Corner AI gives one useful correction and lets you retry.
- It complements real coaching rather than replacing it.

## Page Structure

The page contains only five visible elements in the main flow:

1. **Headline**
   - `Stop practicing the same mistakes.`

2. **Short context**
   - One concise sentence tying together the cost of private coaching and the lack of feedback when training alone.
   - No paragraph-length explanation.

3. **Concrete result visual**
   - Prominent, app-like result block showing:
     - `Rear hand dropped on 6/10 jabs`
     - `Keep your rear hand on your cheek.`
     - `Try again`
     - `6 mistakes → 2`
   - Desktop: placed beside the headline/context.
   - Mobile: placed directly underneath.
   - This result should be almost as visually important as the headline.

4. **Primary CTA**
   - `Join the beta`
   - Supporting microcopy: `Concept app. Help shape what we build.`
   - No secondary CTA competing for attention.

5. **Single supporting line + footer**
   - `A coach for the sessions when your coach isn’t there.`
   - Minimal footer with Corner AI branding and concept-validation note.

## Explicit Removals

Remove the current:

- comparison / “missing middle” cards
- long economic explanation
- common-mistakes / pain section
- separate “how it works” section
- repeated product explanations
- repeated CTAs
- visible video placeholder until a real demo asset exists
- extra section labels and decorative content that do not improve comprehension or conversion

The page should not feel like a SaaS landing page or a product explainer deck.

## Visual Direction

Keep the current visual system:

- near-black background
- white typography
- lime accent
- premium, restrained boxing feel
- sharp spacing and typography
- no gradients, robot imagery, stock photography, or generic AI visuals

Simplify the layout substantially:

- generous negative space
- no dense grids
- one dominant visual hierarchy
- result block should feel like a real app output, not a marketing infographic
- mobile-first, with the CTA reachable without excessive scrolling

## Behavior

Existing beta form behavior and Supabase wiring remain unchanged:

- CTA opens the existing beta dialog
- form fields and validation stay as-is
- successful submissions go to Supabase
- funnel analytics remain intact
- video configuration can remain in code, but no video UI is shown until a real concept video exists

No new backend features or analytics events are added.

## Success Criteria

- Visitor can understand the idea in under five seconds.
- One obvious CTA with no competing action.
- Concrete result visible immediately on desktop and shortly after the headline on mobile.
- Page is substantially shorter than the current version.
- No horizontal overflow at desktop or mobile widths.
- Existing form and Supabase validation flow continue to work unchanged.
- Visual style remains premium and consumer-fitness oriented rather than SaaS-like.

## Scope

This is a content and layout reduction only. No new product claims, features, backend systems, or tracking infrastructure are introduced.
