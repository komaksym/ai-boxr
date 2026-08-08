window.CORNER_AI_CONFIG = {
  // Drop the 9:16 concept video into /assets later and set this path.
  // Leaving it blank keeps the designed video placeholder visible.
  conceptVideoUrl: '',

  // Public Supabase client configuration. The publishable key is safe to ship
  // in browser code; database access is restricted by Row Level Security.
  supabaseUrl: 'https://mvgzdcqhdruhjoexbdqp.supabase.co',
  supabasePublishableKey: 'sb_publishable_geG83qIZVsxdbcH5tL9YlQ_3r7fGccv',

  // Optional secondary analytics. Supabase is the source of truth for the
  // validation funnel, so PostHog can remain disabled.
  posthogKey: 'REPLACE_WITH_POSTHOG_KEY',
  posthogHost: 'https://eu.i.posthog.com',
};
