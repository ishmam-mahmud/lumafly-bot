import * as Sentry from '@sentry/node';
import { getEnv } from './getEnv';

const dsn = getEnv('SENTRY_DSN');
if (dsn) {
  Sentry.init({
    dsn,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

export default async function logError(error: any) {
  console.error(error);
  console.log(JSON.stringify(error));
  return;
  // return Sentry.captureException(error);
}
