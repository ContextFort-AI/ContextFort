// posthog-config.js
import posthog from 'posthog-js';

let posthogInitialized = false;

export const initPostHog = () => {
  if (posthogInitialized) return;

    posthog.init('phc_BwH9To2ytkZmR3NuXoSs8ZLUOGQrhN4MiJFNSOBHWrX', {
    
        api_host: 'https://us.i.posthog.com',
        disable_external_dependency_loading: true,
        persistence: 'localStorage',
        loaded: (posthog) => {
        console.log('PostHog loaded successfully');
        }
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