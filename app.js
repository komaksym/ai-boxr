(() => {
  const config = window.CORNER_AI_CONFIG || {};
  const dialog = document.getElementById('beta-dialog');
  const form = document.getElementById('beta-form');
  const formView = document.getElementById('form-view');
  const successView = document.getElementById('success-view');
  const formError = document.getElementById('form-error');
  const submitButton = document.getElementById('submit-form');
  const video = document.getElementById('demo-video');
  let formStarted = false;

  const query = new URLSearchParams(window.location.search);
  const attribution = {
    utm_source: query.get('utm_source') || '',
    utm_medium: query.get('utm_medium') || '',
    utm_campaign: query.get('utm_campaign') || '',
    utm_content: query.get('utm_content') || '',
    utm_term: query.get('utm_term') || '',
    referrer: document.referrer || '',
    landing_url: window.location.href,
  };

  function normalizedSource() {
    const haystack = `${attribution.utm_source} ${attribution.referrer}`.toLowerCase();
    if (haystack.includes('tiktok')) return 'tiktok';
    if (haystack.includes('instagram') || haystack.includes('l.instagram')) return 'instagram';
    if (haystack.includes('facebook') || haystack.includes('fb.com') || haystack.includes('l.facebook')) return 'facebook';
    return attribution.utm_source || (attribution.referrer ? 'referral' : 'direct');
  }

  function hasRealValue(value, placeholderPrefix = 'REPLACE_WITH') {
    return Boolean(value) && !String(value).startsWith(placeholderPrefix);
  }

  function makeUuid() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function getSessionId() {
    const key = 'corner_ai_validation_session';
    try {
      const existing = sessionStorage.getItem(key);
      if (existing) return existing;
      const created = makeUuid();
      sessionStorage.setItem(key, created);
      return created;
    } catch {
      return makeUuid();
    }
  }

  const sessionId = getSessionId();

  function supabaseConfigured() {
    return hasRealValue(config.supabaseUrl) && hasRealValue(config.supabasePublishableKey);
  }

  async function insertSupabase(table, row, { keepalive = false } = {}) {
    if (!supabaseConfigured()) throw new Error('Supabase is not configured.');

    return fetch(`${config.supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      keepalive,
      headers: {
        apikey: config.supabasePublishableKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
  }

  function bootPostHog() {
    if (!hasRealValue(config.posthogKey)) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `${config.posthogHost || 'https://eu.i.posthog.com'}/static/array.js`;
    script.onload = () => {
      if (!window.posthog) return;
      window.posthog.init(config.posthogKey, {
        api_host: config.posthogHost || 'https://eu.i.posthog.com',
        capture_pageview: false,
        person_profiles: 'identified_only',
      });
    };
    document.head.appendChild(script);
  }

  window.cornerAiEvents = window.cornerAiEvents || [];

  function track(event, properties = {}) {
    const payload = {
      event,
      properties: {
        ...attribution,
        traffic_source: normalizedSource(),
        path: window.location.pathname,
        ...properties,
      },
      timestamp: new Date().toISOString(),
    };

    window.cornerAiEvents.push(payload);
    window.dispatchEvent(new CustomEvent('corner-ai:event', { detail: payload }));
    if (window.posthog?.capture) window.posthog.capture(event, payload.properties);

    if (supabaseConfigured()) {
      void insertSupabase('corner_ai_validation_events', {
        event_name: event,
        session_id: sessionId,
        traffic_source: normalizedSource(),
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        utm_term: attribution.utm_term,
        referrer: attribution.referrer,
        landing_url: attribution.landing_url,
        path: window.location.pathname,
        metadata: properties,
      }, { keepalive: true }).catch(() => {});
    }
  }

  function resetFormState() {
    formView.hidden = false;
    successView.hidden = true;
    formError.hidden = true;
    formError.textContent = '';
    submitButton.disabled = false;
    submitButton.firstChild.textContent = 'Join the beta ';
  }

  function openDialog() {
    track('join_beta_click');
    resetFormState();
    if (!dialog.open) dialog.showModal();
    window.setTimeout(() => form.elements.email.focus(), 0);
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  document.querySelectorAll('.js-beta-cta').forEach((button) => {
    button.addEventListener('click', openDialog);
  });

  document.getElementById('close-dialog').addEventListener('click', closeDialog);
  document.getElementById('done-dialog').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) closeDialog();
  });

  form.addEventListener('focusin', () => {
    if (formStarted) return;
    formStarted = true;
    track('form_start');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.firstChild.textContent = 'Sending… ';

    const payload = Object.fromEntries(new FormData(form).entries());
    const application = {
      email: String(payload.email).trim().toLowerCase(),
      boxing_experience: payload.boxing_experience,
      solo_training_frequency: payload.solo_training_frequency,
      device: payload.device,
      willingness_to_pay: payload.willingness_to_pay,
      technique_issue: String(payload.technique_issue || '').trim() || null,
      traffic_source: normalizedSource(),
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      referrer: attribution.referrer,
      landing_url: attribution.landing_url,
    };

    try {
      const response = await insertSupabase('corner_ai_beta_applications', application);

      // A repeated email is still evidence of intent. Keep one application row,
      // but treat a duplicate signup as a successful user experience.
      if (!response.ok && response.status !== 409) {
        throw new Error(`Signup endpoint returned ${response.status}`);
      }

      track('form_submit', {
        boxing_experience: application.boxing_experience,
        solo_training_frequency: application.solo_training_frequency,
        device: application.device,
        willingness_to_pay: application.willingness_to_pay,
        duplicate_email: response.status === 409,
      });

      formView.hidden = true;
      successView.hidden = false;
      document.getElementById('done-dialog').focus();
      form.reset();
    } catch (error) {
      formError.textContent = 'Could not save your application. Please try again.';
      formError.hidden = false;
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.firstChild.textContent = 'Join the beta ';
    }
  });

  if (video) {
    if (hasRealValue(config.conceptVideoUrl)) {
      video.src = config.conceptVideoUrl;
      video.load();
    }
    video.addEventListener('canplay', () => { video.dataset.ready = 'true'; }, { once: true });
    video.addEventListener('play', () => track('demo_video_play'), { once: true });
    video.addEventListener('ended', () => track('demo_video_complete'));
  }

  bootPostHog();
  track('page_view');
})();
