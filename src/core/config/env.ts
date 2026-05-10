/**
 * Central place for environment/runtime configuration.
 * For local dev the gateway IP is the host machine LAN address
 * (not "localhost" — Expo Go runs on a physical device).
 */
export const ENV = {
  GATEWAY_BASE_URL: 'http://192.200.1.27:3000',
} as const;
