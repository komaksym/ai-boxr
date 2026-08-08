# Corner AI landing page

A deliberately small validation page for **Corner AI**, a concept iPhone app for amateur boxers who train alone.

The page validates one question:

> Will amateur boxers want a phone-based AI coach that identifies technique mistakes, gives a correction, and lets them retry?

## Launch checklist

1. Add the 9:16 demo video at `assets/concept-demo.mp4` (or change `conceptVideoUrl` in `config.js`).
2. Set a real JSON form endpoint in `config.js`.
3. Add a PostHog project key in `config.js` if you want hosted analytics.
4. Deploy the directory to Vercel.

No build step is required.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Configuration

All external configuration is isolated in `config.js`:

```js
window.CORNER_AI_CONFIG = {
  conceptVideoUrl: '/assets/concept-demo.mp4',
  formEndpoint: 'https://your-form-endpoint.example/submit',
  posthogKey: 'phc_your_project_key',
  posthogHost: 'https://eu.i.posthog.com',
};
```

Until `formEndpoint` is replaced, submissions intentionally fail with a setup message instead of pretending the application was saved.

## Validation events

The page emits:

- `page_view`
- `demo_video_play`
- `demo_video_complete`
- `join_beta_click`
- `form_start`
- `form_submit`

When PostHog is configured, these are sent to PostHog. They are also written to `window.__cornerAiEvents` so the event flow can be verified locally.

Every event includes captured attribution when present:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- normalized `traffic_source` for TikTok / Instagram / Facebook

## Form payload

The configured endpoint receives JSON with:

- email
- boxing experience
- solo training frequency
- device
- willingness to pay around €9.99/month
- optional technique issue
- attribution parameters
- referring URL and page URL

## Deployment

The repository includes `vercel.json`, so the folder can be imported into Vercel as a static project with no framework or build configuration required.
