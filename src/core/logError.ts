import * as Sentry from "@sentry/node";
import { inspect } from "util";
import getEnv from "./getEnv";

Sentry.init({
  dsn: getEnv("SENTRY_DSN"),
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export default function logError(error: any) {
  console.error(error);
  console.error(JSON.stringify(error))
  console.error(inspect(error, true, Infinity))
  return Sentry.captureException(error);
}
