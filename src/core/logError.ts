import * as Sentry from "@sentry/node";
import getEnv from "./getEnv";

Sentry.init({
  dsn: getEnv("SENTRY_DSN"),
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export default async function logError(error: any) {
  return Sentry.captureException(error);
}
