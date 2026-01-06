// posthog-config.js
import posthog from 'posthog-js';

let posthogInitialized = false;

export const initPostHog = () => {
  if (posthogInitialized) return;

    posthog.init(process.env.POSTHOG_KEY, {
    
        api_host: 'https://us.i.posthog.com',
        disable_external_dependency_loading: true,
        persistence: 'localStorage'
    });

  posthogInitialized = true;
};

export const trackEvent = (eventName, properties = {}) => {
  if (posthog) {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId, userProperties = {}) => {
  if (posthog) {
    posthog.identify(userId, userProperties);
  }
};

export { posthog };