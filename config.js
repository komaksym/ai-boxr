window.CORNER_AI_CONFIG = {
  // REQUIRED FOR THE REAL DEMO. Example: '/assets/concept-demo.mp4'.
  conceptVideoUrl: 'REPLACE_WITH_CONCEPT_VIDEO_URL',

  // REQUIRED BEFORE LAUNCH. Formspree, Supabase Edge Function, or any endpoint that accepts JSON POST.
  formEndpoint: 'REPLACE_WITH_FORM_ENDPOINT',

  // OPTIONAL. Leave as-is to disable PostHog; local event capture still works for QA.
  posthogKey: 'REPLACE_WITH_POSTHOG_KEY',
  posthogHost: 'https://eu.i.posthog.com',
};
