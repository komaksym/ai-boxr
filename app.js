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
    referrer: document.referrer || '',
  };

  function normalizedSource() {
    const haystack = `${attribution.utm_source} ${attribution.referrer}`.toLowerCase();
    if (haystack.includes('tiktok')) return 'tiktok';
    if (haystack.includes('instagram') || haystack.includes('l.instagram')) return 'instagram';
    if (haystack.includes('facebook') || haystack.includes('fb.com') || haystack.includes('l.facebook')) return 'facebook';
    return attribution.utm_source || (attribution.referrer ? 'referral' : 'direct');
  }

  function hasRealValue(value, placeholderPrefix) {
    return Boolean(value) && !String(value).startsWith(placeholderPrefix);
  }

  function bootPostHog() {
    if (!hasRealValue(config.posthogKey, 'REPLACE_WITH')) return;
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
    Object.assign(payload, attribution, { traffic_source: normalizedSource() });

    try {
      const configuredEndpoint = hasRealValue(config.formEndpoint, 'REPLACE_WITH');
      const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

      if (configuredEndpoint) {
        const response = await fetch(config.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
      } else if (!isLocal) {
        throw new Error('Beta form is not connected yet. Configure formEndpoint in config.js before launch.');
      }

      track('form_submit', {
        boxing_experience: payload.boxing_experience,
        solo_training_frequency: payload.solo_training_frequency,
        device: payload.device,
        willingness_to_pay: payload.willingness_to_pay,
      });
      formView.hidden = true;
      successView.hidden = false;
      document.getElementById('done-dialog').focus();
      form.reset();
    } catch (error) {
      formError.textContent = error.message || 'Something went wrong. Please try again.';
      formError.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.firstChild.textContent = 'Join the beta ';
    }
  });

  if (video) {
    if (hasRealValue(config.conceptVideoUrl, 'REPLACE_WITH')) {
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
